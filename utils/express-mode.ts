import { createClient } from './supabase/server';

// Parse markdown response into separate files
export function parseMarkdownOutput(markdown: string): { fileName: string; content: string }[] {
    try {
        console.log("Starting to parse markdown output...");

        // Extract the content between <final_code> and </final_code>
        const finalCodeMatch = markdown.match(/<final_code>([\s\S]*?)<\/final_code>/);
        const finalCodeContent = finalCodeMatch ? finalCodeMatch[1].trim() : markdown;

        console.log("Extracted final code content, length:", finalCodeContent.length);

        // Check if there are file headers (## filename)
        const hasFileHeaders = /^## /m.test(finalCodeContent);

        if (hasFileHeaders) {
            console.log("Found file headers in the output, parsing normally");
            // Split the markdown into sections by ## (file headers)
            const sections = finalCodeContent.split(/^## /m).filter(Boolean);

            if (sections.length === 0) {
                console.error("No file sections found in the AI output");
                return [];
            }

            const fileContents: { fileName: string; content: string }[] = [];

            for (const section of sections) {
                const lines = section.split('\n');

                // The first line is the file name
                const fileName = lines[0].trim();

                // Skip sections with empty file names
                if (!fileName) {
                    console.warn("Skipping section with empty file name");
                    continue;
                }

                // Find the code block content
                const codeBlockStart = lines.findIndex(line => line.includes('```html')) + 1;
                const codeBlockEnd = lines.findIndex((line, index) => index > codeBlockStart && line.includes('```'));

                if (codeBlockStart > 0 && codeBlockEnd > codeBlockStart) {
                    // Extract the content between ```html and ```
                    const codeContent = lines.slice(codeBlockStart, codeBlockEnd).join('\n');
                    fileContents.push({ fileName, content: codeContent });
                } else {
                    // If no code block markers are found, use everything after the first line
                    const content = lines.slice(1).join('\n').trim();
                    // Only add if there's actual content
                    if (content) {
                        fileContents.push({ fileName, content });
                    } else {
                        console.warn(`Skipping section with empty content for file: ${fileName}`);
                    }
                }
            }

            // Log the parsed files for debugging
            console.log(`Parsed ${fileContents.length} files from AI output:`,
                fileContents.map(f => f.fileName).join(', '));

            return fileContents;
        } else {
            // If no file headers are found, try to extract HTML content directly
            console.log("No file headers found, attempting to extract HTML directly");

            // Look for HTML code blocks
            const htmlCodeBlocks = finalCodeContent.match(/```html\n([\s\S]*?)```/g) || finalCodeContent.match(/\`\`\`html\n([\s\S]*?)\`\`\`/g);

            if (htmlCodeBlocks && htmlCodeBlocks.length > 0) {
                console.log(`Found ${htmlCodeBlocks.length} HTML code blocks`);

                const fileContents: { fileName: string; content: string }[] = [];

                // Process each HTML block
                htmlCodeBlocks.forEach((block, index) => {
                    // Extract content between ```html and ```
                    const content = block.replace(/```html\n/, '').replace(/\`\`\`html\n/, '').replace(/```$/, '').replace(/\`\`\`$/, '').trim();

                    if (content) {
                        // Generate a filename if none exists
                        const fileName = index === 0 ? "index.html" : `page-${index}.html`;
                        fileContents.push({ fileName, content });
                        console.log(`Created file: ${fileName} with ${content.length} characters`);
                    }
                });

                return fileContents;
            } else {
                // If no HTML code blocks, check if there's a complete HTML document
                console.log("No HTML code blocks found, checking for complete HTML document");

                if (finalCodeContent.includes('<!DOCTYPE html>') || finalCodeContent.includes('<html>')) {
                    console.log("Found HTML document, creating index.html");
                    return [{
                        fileName: "index.html",
                        content: finalCodeContent.trim()
                    }];
                }

                // Last resort: create a default HTML file with whatever content we have
                console.log("Creating default index.html with available content");
                return [{
                    fileName: "index.html",
                    content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
</head>
<body>
    ${finalCodeContent}
</body>
</html>`
                }];
            }
        }
    } catch (error) {
        console.error("Error parsing markdown output:", error);
        // Create a fallback file with error information
        return [{
            fileName: "index.html",
            content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Generating Website</title>
</head>
<body>
    <h1>Error Generating Website</h1>
    <p>There was an error parsing the AI output. Please try again.</p>
    <pre>${error instanceof Error ? error.message : String(error)}</pre>
</body>
</html>`
        }];
    }
}

// Save generated pages to Supabase
export async function saveGeneratedPages(
    userId: string,
    websiteId: string,
    websiteCode: string
): Promise<boolean> {
    try {
        const supabase = await createClient();

        // Parse markdown into separate pages
        const pages = parseMarkdownOutput(websiteCode);

        if (pages.length === 0) {
            throw new Error("No pages were generated");
        }

        // Prepare bulk insert data
        const pagesToInsert = pages.map(page => ({
            user_id: userId,
            website_id: websiteId,
            title: page.fileName,
            content: page.content,
        }));

        console.log(`Inserting ${pagesToInsert.length} pages into database`);

        // Save all pages in one operation
        const { error } = await supabase.from("pages").insert(pagesToInsert);

        if (error) {
            throw error;
        }

        // Get page names, ensuring no empty strings
        const pageNames = pages.map(page => page.fileName).filter(name => name.trim() !== '');

        console.log(`Updating website with page list: ${pageNames.join(', ')}`);

        // Update website with page list and status
        const { error: updateError } = await supabase
            .from("websites")
            .update({
                pages: pageNames,
                status: "completed"
            })
            .eq("id", websiteId);

        if (updateError) {
            throw updateError;
        }

        return true;
    } catch (error) {
        console.error("Failed to save generated pages:", error);
        throw error;
    }
}

// Create a new website record in Supabase
export async function createWebsiteRecord(
    userId: string,
    websiteName: string = "Express Website",
    websiteDescription: string = "Generated with Express Mode",
    subdomain: string = generateRandomSubdomain(),
    mode: string = "express",
    enhancedPrompt: string = ""
) {
    try {
        const supabase = await createClient();

        // Create website record
        const { data, error } = await supabase
            .from("websites")
            .insert({
                user_id: userId,
                website_name: websiteName,
                website_description: websiteDescription,
                subdomain: subdomain,
                status: "generating",
                is_public: false,
                mode: mode,
                enhanced_prompt: enhancedPrompt
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error creating website record:", error);
        throw error;
    }
}

// Generate a random subdomain name
export function generateRandomSubdomain(): string {
    const adjectives = [
        "cool", "awesome", "amazing", "brilliant", "fantastic",
        "incredible", "magnificent", "wonderful", "stellar", "supreme"
    ];

    const nouns = [
        "site", "space", "place", "spot", "hub",
        "zone", "realm", "world", "domain", "space"
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);

    return `${randomAdjective}-${randomNoun}-${randomNum}`;
}

// Utility function to fix websites with empty page names
export async function fixWebsiteWithEmptyPages(websiteId: string) {
    try {
        const supabase = await createClient();

        // Get the website data
        const { data: website, error: websiteError } = await supabase
            .from("websites")
            .select("pages, user_id")
            .eq("id", websiteId)
            .single();

        if (websiteError) {
            throw websiteError;
        }

        // Check if pages array has empty strings
        if (!website.pages || !Array.isArray(website.pages)) {
            console.log(`Website ${websiteId} has no pages array`);
            return { fixed: false, reason: "No pages array" };
        }

        // Filter out empty page names
        const validPages = website.pages.filter(page => page && page.trim() !== '');

        // If no change needed, return early
        if (JSON.stringify(validPages) === JSON.stringify(website.pages)) {
            console.log(`Website ${websiteId} has no empty pages to fix`);
            return { fixed: false, reason: "No empty pages" };
        }

        // If no valid pages, try to find pages in the database
        if (validPages.length === 0) {
            console.log(`Website ${websiteId} has no valid pages, checking database`);

            // Get pages from database
            const { data: pagesFromDb, error: pagesError } = await supabase
                .from("pages")
                .select("title")
                .eq("website_id", websiteId)
                .eq("user_id", website.user_id);

            if (pagesError) {
                throw pagesError;
            }

            if (pagesFromDb && pagesFromDb.length > 0) {
                // Use page titles from database
                const pageNamesFromDb = pagesFromDb.map(p => p.title).filter(title => title && title.trim() !== '');

                if (pageNamesFromDb.length > 0) {
                    // Update website with page names from database
                    const { error: updateError } = await supabase
                        .from("websites")
                        .update({ pages: pageNamesFromDb })
                        .eq("id", websiteId);

                    if (updateError) {
                        throw updateError;
                    }

                    console.log(`Fixed website ${websiteId} with ${pageNamesFromDb.length} pages from database`);
                    return { fixed: true, pages: pageNamesFromDb };
                }
            }

            // If still no valid pages, create a default page
            console.log(`No valid pages found in database for website ${websiteId}, creating default`);

            // Create a default index.html page if none exists
            const defaultPage = {
                user_id: website.user_id,
                website_id: websiteId,
                title: "index.html",
                content: "<h1>Welcome to your website</h1><p>This is a default page created because no valid pages were found.</p>"
            };

            const { error: insertError } = await supabase
                .from("pages")
                .insert(defaultPage);

            if (insertError) {
                throw insertError;
            }

            // Update website with default page
            const { error: updateError } = await supabase
                .from("websites")
                .update({ pages: ["index.html"] })
                .eq("id", websiteId);

            if (updateError) {
                throw updateError;
            }

            console.log(`Created default page for website ${websiteId}`);
            return { fixed: true, pages: ["index.html"], default: true };
        }

        // Update website with valid pages
        const { error: updateError } = await supabase
            .from("websites")
            .update({ pages: validPages })
            .eq("id", websiteId);

        if (updateError) {
            throw updateError;
        }

        console.log(`Fixed website ${websiteId} by removing empty pages, now has ${validPages.length} pages`);
        return { fixed: true, pages: validPages };
    } catch (error) {
        console.error(`Error fixing website ${websiteId}:`, error);
        throw error;
    }
} 