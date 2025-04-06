import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  BedrockRuntimeClientConfig,
  InvokeModelCommandOutput
} from "@aws-sdk/client-bedrock-runtime";
import { PCMessage } from '@/hooks/useProChatStore';
import { sendWebsiteGenerationCompleteEmail } from "@/utils/email";
import https from 'https';
import crypto from 'crypto';
import serverLogger from "@/utils/server-logger";

// --- AWS SDK Configuration via Environment Variables ---
// Set these at the top level to ensure they are applied globally before any client initialization
const EXTENDED_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const CONNECT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Create a custom HTTPS agent with extended timeouts
const httpsAgent = new https.Agent({
  keepAlive: true,
  timeout: EXTENDED_TIMEOUT_MS,
  scheduling: 'fifo',
});

// Initialize Bedrock client with comprehensive configuration
const clientConfig: BedrockRuntimeClientConfig = {
  region: process.env.AWS_REGION || 'us-west-2',
  maxAttempts: 5,
  requestHandler: {
    httpAgent: httpsAgent,
  },
  retryMode: 'standard'
};

const bedrockClient = new BedrockRuntimeClient(clientConfig);

// AWS Claude model ID for Claude 3.7 Sonnet
const MODEL_ID = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";

// Export config for API route with extended timeouts
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
    // Add explicit timeout configuration for the API route
    externalResolver: true,
  },
};

// Define a system prompt for high-quality website generation
const WEBSITE_GENERATION_SYSTEM_PROMPT = `You are an expert website designer and developer with exceptional skills in creating visually stunning, modern websites that perfectly match user requirements.

Your primary goal is to analyze the complete chat conversation and project brief to create a production-ready website with beautiful aesthetics as the HIGHEST priority. This is for the PRO mode of RapidSite, which emphasizes quality and detail over speed.

<design_guidelines>
- Create visually stunning designer websites that follow current web design trends
- Use Tailwind CSS for styling with minimal custom CSS
- Each section must be meticulously designed with animations, visual appeal, and modern design techniques
- Create an interactive experience with micro-animations and engaging transitions
- Utilize 3D elements, parallax effects, and layered designs to create depth
- Ensure responsive design that works on all device sizes
- Focus on accessibility and performance
- Deliver a fully functional website, not just mockups
</design_guidelines>

<technical_requirements>
- Use HTML5, Tailwind CSS, and vanilla JavaScript with CDNs only
- The website must be ENTIRELY client-side - NO SERVER-SIDE CODE or backend functionality
- Forms can capture data but cannot process it server-side (use the form-capture.js CDN)
- All resources must be loaded from approved CDNs or use placeholder images
- All placeholder images must use placehold.co in format: https://placehold.co/[width]x[height]
- Code must be valid HTML5, CSS3, and modern JavaScript (ES6+)
</technical_requirements>

<animation_guidelines>
- Every section should incorporate thoughtful animations that enhance visual appeal
- Implement scroll-triggered animations using AOS or GSAP ScrollTrigger for content reveals
- Use GSAP for complex, timeline-based animations that create engaging user experiences
- Add hover animations on all interactive elements (buttons, cards, links, etc.)
- Implement parallax effects for depth and visual interest
- Use animated gradients for backgrounds, buttons, or accent elements
- Create smooth transitions between sections and pages
- Add micro-interactions that provide feedback on user actions
- Design custom cursor effects for interactive elements when appropriate
- Use Three.js for 3D elements or advanced visual effects when appropriate
</animation_guidelines>

<approved_technologies>
List of approved external resources with direct implementation tags

    - <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      Description: Font Awesome icons for all icon needs throughout the site

    - <script src="https://cdn.tailwindcss.com"></script>
      Description: Tailwind CSS framework for styling the entire website

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
      Description: GreenSock Animation Platform (GSAP) - Core for advanced animations

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
      Description: GSAP ScrollTrigger plugin for scroll-based animations

    - <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css">
      Description: Swiper CSS for sliders and carousels

    - <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
      Description: Animate On Scroll library CSS

    - <script src="https://cdn.jsdelivr.net/npm/framer-motion@11.15.0/dist/framer-motion.min.js"></script>
      Description: Framer Motion animation library for interactive animations

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/particlesjs/2.2.3/particles.min.js"></script>
      Description: Particles.js for background particle effects

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js"></script>
      Description: Swiper for sliders and carousels

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.13.5/cdn.min.js" defer></script>
      Description: Alpine.js for interactive UI components

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
      Description: Animate On Scroll library for scroll-based animations

    - <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      Description: Three.js for 3D effects and WebGL experiences

    - <script src="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js"></script>
      Description: Locomotive Scroll for smooth scrolling effects

    - <script src="https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.0/dist/vanilla-tilt.min.js"></script>
      Description: Vanilla Tilt for 3D tilt effects on elements

    - <script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12/lib/typed.min.js"></script>
      Description: Typed.js for animated typing effects

    - <script src="https://cdn.jsdelivr.net/npm/granim@2.0.0/dist/granim.min.js"></script>
      Description: Granim.js for animated gradients

    - <script src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js"></script>
      Description: tsParticles for advanced particle effects

    - <script src="https://cdn.jsdelivr.net/npm/kute.js@2.2.4/dist/kute.min.js"></script>
      Description: KUTE.js for advanced shape morphing animations

    - <script src="https://rapidai.website/form-capture.js"></script>
      Description: Form capture utility which makes any form work, so you don't need to add form backend,just make it as a form and use the cdn and form capture will work directly sending the form response to the user via email.

</approved_technologies>

<output_format>
Your output should be in the following format:

<thinking>
This section is where you analyze the chat conversation and project brief, plan the website structure, design features, and determine the technical approach. This should be a detailed analysis showing your thought process.
</thinking>

<final_code>

## index.html
\`\`\`html
<!DOCTYPE html >
    <html>
    <!--Complete HTML code for homepage-- >
        </html>
            \`\`\`

## page-name.html (if needed)
\`\`\`html
    < !DOCTYPE html >
    <html>
    <!--Complete HTML code for additional pages-- >
        </html>
            \`\`\`

</final_code>
</output_format>

IMPORTANT FORMATTING INSTRUCTIONS:
1. You MUST include the "## index.html" header before each file's code block
2. Each file must be preceded by "## " followed by the filename
3. The HTML code must be enclosed in \`\`\`html and \`\`\` tags
4. Do not omit the file headers or code block markers
5. Always include at least one file named "index.html"
6. DO NOT WORRY ABOUT OUTPUT LENGTH - longer code is completely fine and expected for sophisticated designs. You can output as much code as needed to create a truly impressive website. Each page and section should be FULLY IMPLEMENTED with extensive detail.`;

// Store ongoing generations
const activeGenerations = new Map<string, {
  status: 'pending' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime: number;
}>();

export async function POST(request: NextRequest) {
  try {
    // Get data from request body
    const { brief, messages, chatState, userId, websiteId } = await request.json();

    if (!brief || !messages || !chatState) {
      return NextResponse.json({ error: "Required data is missing" }, { status: 400 });
    }

    // Track website generation start
    if (userId) {
      serverLogger.track('website_generation_started', userId, {
        mode: 'pro',
        websiteId,
        brief_type: brief.type || 'custom',
        message_count: messages.length,
        timestamp: new Date().toISOString()
      });
    }

    // Generate a unique job ID
    const jobId = crypto.randomUUID();

    // Store the generation job
    activeGenerations.set(jobId, {
      status: 'pending',
      startTime: Date.now(),
    });

    // Start the generation process in the background
    generateWebsite(jobId, brief, messages, chatState, userId, websiteId).catch(error => {
      console.error('Background generation failed:', error);
      activeGenerations.set(jobId, {
        status: 'failed',
        error: error.message,
        startTime: Date.now(),
      });
    });

    // Return immediately with the job ID
    return NextResponse.json({
      jobId,
      message: "Website generation started",
      status: "pending"
    });

  } catch (error) {
    console.error("Error initiating website generation:", error);
    return NextResponse.json(
      { error: "Failed to start website generation" },
      { status: 500 }
    );
  }
}

// New GET endpoint to check generation status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  const generation = activeGenerations.get(jobId);
  if (!generation) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Calculate elapsed time
  const elapsedSeconds = Math.round((Date.now() - generation.startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeElapsed = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Clean up completed/failed jobs older than 1 hour
  const now = Date.now();
  Array.from(activeGenerations.entries()).forEach(([id, job]) => {
    if (job.status !== 'pending' && (now - job.startTime) > 3600000) {
      activeGenerations.delete(id);
    }
  });

  return NextResponse.json({
    status: generation.status,
    result: generation.result,
    error: generation.error,
    timeElapsed,
    message: generation.status === 'pending' ? `Generation in progress... (${timeElapsed})` : undefined
  });
}

// Background generation function
async function generateWebsite(
  jobId: string,
  brief: any,
  messages: PCMessage[],
  chatState: string,
  userId?: string,
  websiteId?: string
) {
  const supabase = await createClient();
  const startTime = Date.now();

  try {
    // Verify user and website if IDs provided
    let websiteData;
    let userEmail = '';

    if (userId && websiteId) {
      const { data, error: websiteError } = await supabase
        .from("websites")
        .select("*, users(email)")
        .eq("id", websiteId)
        .eq("user_id", userId)
        .single();

      if (websiteError || !data) {
        throw new Error("Website not found or not authorized");
      }

      websiteData = data;
      userEmail = data.users?.email || '';

      // Update website status to generating
      await supabase
        .from("websites")
        .update({
          status: "generating",
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", websiteId);
    }

    // Format chat history and brief into a coherent prompt
    const chatHistory = messages.map(m =>
      `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n\n');

    const briefSummary = Object.entries(brief)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Prepare the request body for Claude with proper versioning
    const input = {
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 50000,
        temperature: 0.7,
        system: WEBSITE_GENERATION_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `# Website Generation Request

## Project Brief
${briefSummary}

## Chat Conversation History
${chatHistory}

Based on the above conversation and project brief, please generate a complete website as described in the instructions. Focus on creating a visually stunning, modern, and high-quality website that perfectly matches the requirements discussed in the conversation.`
          }
        ]
      })
    };

    console.log("Starting Bedrock request...", {
      timestamp: new Date().toISOString(),
      jobId,
      modelId: MODEL_ID,
      timeoutSettings: {
        socketTimeout: EXTENDED_TIMEOUT_MS,
        connectTimeout: CONNECT_TIMEOUT_MS
      }
    });

    const command = new InvokeModelCommand(input);

    // Add timeout promise to handle hard timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Operation timed out after ' + EXTENDED_TIMEOUT_MS / 1000 + ' seconds'));
      }, EXTENDED_TIMEOUT_MS);
    });

    // Race between the actual request and timeout
    const response = await Promise.race([
      bedrockClient.send(command),
      timeoutPromise
    ]) as InvokeModelCommandOutput;

    const elapsedTime = Date.now() - startTime;
    console.log("Received response from Bedrock", {
      timestamp: new Date().toISOString(),
      jobId,
      elapsedTime: `${Math.round(elapsedTime / 1000)}s`
    });

    // Parse the response with error handling and detailed logging
    let text = '';
    try {
      if (!response.body) {
        throw new Error('No response body received from Bedrock');
      }
      const responseBody = new TextDecoder().decode(response.body);

      // Log the full response for debugging
      console.log("=== FULL BEDROCK RESPONSE ===");
      console.log(responseBody);
      console.log("=== END BEDROCK RESPONSE ===");

      const parsedResponse = JSON.parse(responseBody);
      text = parsedResponse.content?.[0]?.text || '';

      if (!text) {
        throw new Error('Empty response from Bedrock');
      }

      // Log the extracted text for debugging
      console.log("=== EXTRACTED TEXT ===");
      console.log(text);
      console.log("=== END EXTRACTED TEXT ===");

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error parsing response';
      console.error("Failed to parse Bedrock response:", errorMessage);
      throw new Error('Failed to parse Bedrock response: ' + errorMessage);
    }

    console.log("Attempting to extract files from response...");
    // Extract HTML files from the response
    const files = extractFilesFromResponse(text);

    console.log("Extracted files:", {
      fileCount: Object.keys(files).length,
      fileNames: Object.keys(files)
    });

    if (Object.keys(files).length === 0) {
      console.error("No files were extracted from the response text. Response format may be incorrect.");
      throw new Error("No valid HTML files were generated");
    }

    // If we have valid website ID and user ID, save the generated pages
    if (userId && websiteId) {
      try {
        console.log(`Saving generated files to database for website ID ${websiteId}`, {
          pageCount: Object.keys(files).length,
          fileNames: Object.keys(files)
        });

        // Save files to database using the proper approach
        await saveGeneratedFilesToDatabase(userId, websiteId, files);

        console.log(`Successfully saved website pages for ID ${websiteId}`);

        // Send email notification
        if (userEmail) {
          const websiteName = websiteData?.name || websiteData?.website_name || "Your new website";
          try {
            await sendWebsiteGenerationCompleteEmail(userEmail, websiteName, websiteId);
            console.log(`Email notification sent to ${userEmail} for website ${websiteName} (ID: ${websiteId})`);
          } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
          }
        }

        // Track generation completion
        if (userId) {
          serverLogger.track('website_generation_completed', userId, {
            mode: 'pro',
            websiteId,
            generation_time_ms: Date.now() - startTime,
            file_count: Object.keys(files).length,
            status: 'success'
          });
        }
      } catch (dbError) {
        console.error("Error saving generated files:", dbError);
        throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
      }
    }

    // Store the successful result
    activeGenerations.set(jobId, {
      status: 'completed',
      result: files,
      startTime: Date.now(),
    });

  } catch (error) {
    console.error("Generation error:", error);

    // Update the job status with the error
    activeGenerations.set(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : "Unknown error",
      startTime: Date.now(),
    });

    // If we have a website ID, update its status to failed
    if (userId && websiteId) {
      await supabase
        .from("websites")
        .update({
          status: "failed",
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", websiteId);
    }

    // Track generation failure
    if (userId) {
      serverLogger.track('website_generation_failed', userId, {
        mode: 'pro',
        websiteId,
        error_type: error instanceof Error ? error.name : 'unknown',
        error_message: error instanceof Error ? error.message : String(error),
        generation_time_ms: Date.now() - startTime
      });
    }

    throw error;
  }
}

// Helper function to extract files from response
function extractFilesFromResponse(response: string): Record<string, string> {
  const files: Record<string, string> = {};

  console.log("Starting file extraction from response");

  // Check if the response contains any likely file markers
  if (!response.includes("## ") || !response.includes("```html")) {
    console.error("Response doesn't contain expected file markers (## filename and ```html)");
    // Look for other patterns in the response to understand the format
    if (response.includes("<thinking>")) {
      console.log("Response contains <thinking> section but may be missing proper file format");
    }
    if (response.includes("<final_code>")) {
      console.log("Response contains <final_code> section but may have formatting issues");
    }
  }

  // Try different potential patterns
  // Standard pattern: ## filename.html followed by ```html ... ```
  const filePattern = /## ([a-zA-Z0-9_\-\.]+)\s*```html([\s\S]*?)```/g;
  let match;
  let matchCount = 0;

  while ((match = filePattern.exec(response)) !== null) {
    matchCount++;
    const filename = match[1].trim();
    const content = match[2].trim();
    console.log(`Found file #${matchCount}: ${filename} (${content.length} chars)`);
    files[filename] = content;
  }

  // If no matches with standard pattern, try alternative patterns
  if (matchCount === 0) {
    console.log("No matches found with standard pattern, trying alternative patterns");

    // Try alternative pattern: may have extra whitespace or different code block format
    const altPattern = /##\s+([a-zA-Z0-9_\-\.]+)[\s\n]*```(?:html)?([\s\S]*?)```/g;
    while ((match = altPattern.exec(response)) !== null) {
      const filename = match[1].trim();
      const content = match[2].trim();
      console.log(`Found file with alternative pattern: ${filename}`);
      files[filename] = content;
    }

    // Try looking for fragments that might be salvageable
    if (Object.keys(files).length === 0) {
      console.log("Searching for HTML fragments that might be salvageable");
      // Look for HTML doctype as a last resort
      const htmlFragments = response.match(/<!DOCTYPE html[\s\S]*?<\/html>/gi);
      if (htmlFragments && htmlFragments.length > 0) {
        console.log(`Found ${htmlFragments.length} HTML fragments, using first one as index.html`);
        files["index.html"] = htmlFragments[0];
        // If there are more fragments, save them as additional pages
        for (let i = 1; i < htmlFragments.length; i++) {
          files[`page-${i}.html`] = htmlFragments[i];
        }
      }
    }
  }

  console.log(`Extraction complete. Found ${Object.keys(files).length} files`);
  return files;
}

// Helper function to save generated files to the database
async function saveGeneratedFilesToDatabase(
  userId: string,
  websiteId: string,
  files: Record<string, string>
): Promise<void> {
  const supabase = await createClient();

  // Convert the files object to array format needed for database
  const filesToInsert = Object.entries(files).map(([fileName, content]) => ({
    user_id: userId,
    website_id: websiteId,
    title: fileName,
    content: content,
  }));

  console.log(`Inserting ${filesToInsert.length} pages into database for website ${websiteId}`);

  // Insert all pages in one operation
  const { error: insertError } = await supabase
    .from("pages")
    .insert(filesToInsert);

  if (insertError) {
    console.error("Error inserting pages:", insertError);
    throw new Error(`Failed to save pages: ${insertError.message}`);
  }

  // Get just the file names for the website record
  const fileNames = Object.keys(files);

  console.log(`Updating website with page list: ${fileNames.join(', ')}`);

  // Update the website record with the list of page names and status
  const { error: updateError } = await supabase
    .from("websites")
    .update({
      status: "live",
      last_updated_at: new Date().toISOString(),
      pages: fileNames
    })
    .eq("id", websiteId);

  if (updateError) {
    console.error("Error updating website with page list:", updateError);
    throw new Error(`Failed to update website: ${updateError.message}`);
  }
} 