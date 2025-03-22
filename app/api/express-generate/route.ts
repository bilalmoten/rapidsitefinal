import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateContent } from "@/utils/gemini";
import { createWebsiteRecord, saveGeneratedPages } from "@/utils/express-mode";

// System prompts for the AI
const ENHANCEMENT_SYSTEM_PROMPT = `You are a professional web designer and developer tasked with enhancing user prompts for website generation. 
Your job is to take a basic user prompt and expand it into a detailed prompt that will result in a beautiful, functional website that incorporates modern design trends.

IMPORTANT: Always respect the user's explicit wishes. If they specify certain design elements, sections, or limitations, do not override these. Your role is to enhance their vision, not replace it.

When enhancing prompts:
1. Identify the business or website type intended
2. Add specific details about layout, color schemes, and content organization
3. Include information about the target audience and desired tone
4. Suggest specific sections that would benefit this type of website (unless the user explicitly limits sections)
5. Recommend fonts, colors, and styling that match the brand identity

MODERN DESIGN TRENDS TO INCORPORATE (when appropriate and not contradicting user specifications):

LAYOUT & STRUCTURE:
- Bento grid layouts: Modular, card-based layouts inspired by Japanese lunch boxes for organized, visually interesting content presentation
- Split-screen designs: Dividing the viewport into distinct sections for contrasting content
- Horizontal scrolling sections: For portfolios, product showcases, or timelines
- Asymmetrical layouts: Breaking from traditional grid systems for more dynamic visual interest
- Overlapping elements: Creating depth by allowing elements to overlap in thoughtful ways

TYPOGRAPHY:
- Oversized/hero typography: Using extremely large text as a design element
- Variable fonts: Fonts that can adjust weight, width, or other attributes dynamically
- Kinetic typography: Animated text that moves or transforms
- Experimental typography: Unique text arrangements, custom fonts, or decorative lettering
- Typography-focused hero sections: Using bold text as the main visual element

VISUAL ELEMENTS:
- Glassmorphism: Frosted glass effect with background blur and transparency
- Neumorphism: Soft UI with subtle shadows creating a raised or inset appearance
- Claymorphism: Soft, rounded elements that appear like clay or plasticine
- Abstract/organic shapes: Fluid, blob-like shapes as background elements or dividers
- Grain textures: Subtle noise textures for added depth and tactile feel
- Gradients: Vibrant, multi-color gradients (especially mesh gradients)
- Dark mode: Sophisticated dark color schemes with careful contrast
- Monochromatic color schemes: Using variations of a single color for elegant simplicity
- Duotone effects: Two-color treatments for images or backgrounds

INTERACTION & ANIMATION:
- Micro-interactions: Subtle animations triggered by user actions (hover, click, scroll)
- Macro-animations: Larger, more noticeable animations for transitions or storytelling
- Scroll-triggered animations: Elements that animate as the user scrolls
- Parallax effects: Multi-layered scrolling creating depth perception
- Cursor effects: Custom cursors or elements that follow cursor movement
- Page transitions: Smooth animations between pages or sections

CONTENT PRESENTATION:
- Data visualization: Interactive charts, graphs, or infographics
- 3D elements: Three-dimensional objects or scenes that users can interact with
- Immersive storytelling: Guided narrative experiences through scrolling or interaction
- Minimalism: Focused design with ample white space and essential elements only
- Maximalism: Bold, expressive designs with rich details and multiple elements

TECHNICAL CONSIDERATIONS:
- Responsive design: Ensuring the site works beautifully across all device sizes
- Accessibility features: Making sure the site is usable by people with disabilities
- Performance optimization: Suggesting techniques that maintain speed despite rich visuals

OUTPUT INSTRUCTIONS:
1. Keep your enhanced prompt concise but comprehensive
2. Do not explain your reasoning, just provide the enhanced prompt
3. Maintain the user's original intent and any specific requirements they mentioned
4. If the user has specified design preferences, prioritize those over suggested trends
5. If the user is clearly knowledgeable about design and has specific requests, focus on refining those rather than introducing new elements

Remember: Your goal is to elevate the user's vision with your design expertise, not to override their specific requirements.`;
const WEBSITE_GENERATION_SYSTEM_PROMPT = `You are an expert website designer and developer with exceptional skills in creating visually stunning, modern websites that perfectly match user requirements.

Your primary goal is to analyze the user prompt and transform it into a complete, production-ready website with beautiful aesthetics as the HIGHEST priority.

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
This section is where you analyze the user's prompt, plan the website structure, design features, and determine the technical approach. This should be a detailed analysis showing your thought process.
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
6. DO NOT WORRY ABOUT OUTPUT LENGTH - longer code is completely fine and expected for sophisticated designs. You can output as much code as needed to create a truly impressive website. Each page and section should be FULLY IMPLEMENTED with extensive detail - do not simplify or reduce features to save space.`;

export async function POST(request: NextRequest) {
    try {
        // Get prompt from request body
        const { prompt, userId, enhancePrompt = true } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const supabase = await createClient();

        // If userId is not provided, check for authenticated user
        let authenticatedUserId = userId;
        if (!authenticatedUserId) {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                authenticatedUserId = user.id;
                // Check if this is an anonymous user
                const isAnonymous = !user.email;
                console.log(`User is ${isAnonymous ? 'anonymous' : 'registered'}, ID: ${user.id}`);
            } else {
                return NextResponse.json(
                    { error: "User authentication required" },
                    { status: 401 }
                );
            }
        }

        // Save the original prompt before enhancement
        const originalPrompt = prompt;
        let enhancedPrompt = prompt; // Default to original if enhancement is skipped

        // Step 1: Enhance the prompt using Gemini Flash if enhancePrompt is true
        if (enhancePrompt) {
            console.log("========== PROMPT ENHANCEMENT PHASE ==========");
            console.log("Original user prompt:", prompt);
            console.log("System prompt for enhancement:", ENHANCEMENT_SYSTEM_PROMPT);

            const enhancementStartTime = Date.now();
            enhancedPrompt = await generateContent(
                prompt,
                {
                    temperature: 0.7,
                    maxOutputTokens: 8000,
                    systemInstruction: ENHANCEMENT_SYSTEM_PROMPT
                }
            );
            const enhancementEndTime = Date.now();

            console.log("Enhanced prompt:", enhancedPrompt);
            console.log(`Enhancement completed in ${(enhancementEndTime - enhancementStartTime) / 1000} seconds`);
            console.log("==============================================");
        } else {
            console.log("Prompt enhancement skipped as per user request");
        }

        // Step 2: Create a website record in Supabase
        console.log("Creating website record...");
        const website = await createWebsiteRecord(
            authenticatedUserId,
            "Express Website", // Default name, can be updated later
            originalPrompt, // Use full original prompt as description
            undefined, // Let the function generate a random subdomain
            "express", // Set mode to express
            enhancedPrompt // Save the enhanced prompt (or original if enhancement skipped)
        );

        // Step 3: Generate the website using Gemini Pro with the enhanced prompt
        console.log("========== WEBSITE GENERATION PHASE ==========");
        console.log("Prompt being sent for generation:", enhancedPrompt);
        console.log("System prompt for website generation:", WEBSITE_GENERATION_SYSTEM_PROMPT);

        const generationStartTime = Date.now();
        const websiteCode = await generateContent(
            enhancedPrompt,
            {
                temperature: 0.7,
                maxOutputTokens: 8192,
                systemInstruction: WEBSITE_GENERATION_SYSTEM_PROMPT
            },
            "gemini-2.0-flash-001" // do not change the mdoel
        );
        const generationEndTime = Date.now();

        console.log("Website generation completed");
        console.log(`Website generation completed in ${(generationEndTime - generationStartTime) / 1000} seconds`);
        // Log the full response for debugging
        console.log("FULL AI RESPONSE:");
        console.log(websiteCode);
        console.log("==============================================");

        // Step 4: Parse and save the generated website to Supabase
        console.log("Saving generated website...");
        console.log("Website code length:", websiteCode.length);

        // Check if the output contains the expected format markers
        const hasFinalCodeTags = websiteCode.includes("<final_code>") && websiteCode.includes("</final_code>");
        const hasThinkingTags = websiteCode.includes("<thinking>") && websiteCode.includes("</thinking>");
        const hasFileHeaders = websiteCode.includes("## ");

        console.log("Output format check:", {
            hasFinalCodeTags,
            hasThinkingTags,
            hasFileHeaders
        });

        await saveGeneratedPages(
            authenticatedUserId,
            website.id,
            websiteCode
        );

        // Step 5: Return success response with website details
        return NextResponse.json({
            success: true,
            websiteId: website.id,
            message: "Website generated successfully",
        });
    } catch (error: any) {
        console.error("Error in express-generate API:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate website" },
            { status: 500 }
        );
    }
} 