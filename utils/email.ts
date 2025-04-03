import { EmailClient } from "@azure/communication-email";
import { render } from "@react-email/render";
import WebsiteCompleteEmail from "@/emails/WebsiteCompleteEmail";

// Only initialize the email client on the server
let emailClient: EmailClient | null = null;

// Make sure we're on the server before initializing
if (typeof window === 'undefined') {
    // Initialize the Email Client server-side only
    try {
        emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING || "");
    } catch (error) {
        console.error("Failed to initialize EmailClient:", error);
    }
}

/**
 * Sends an email notification when a website generation is complete
 * @param userEmail User's email address
 * @param websiteName Name of the website
 * @param websiteId Website ID
 * @returns A boolean indicating if the email was sent successfully
 */
export async function sendWebsiteGenerationCompleteEmail(
    userEmail: string,
    websiteName: string,
    websiteId: string
): Promise<boolean> {
    // Don't attempt to send emails from the client
    if (typeof window !== 'undefined') {
        console.error('Email sending can only be done server-side, not in the browser');
        return false;
    }

    if (!emailClient) {
        console.error('Email client not initialized');
        return false;
    }

    try {
        console.log('Attempting to send website completion email...');

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rapidai.website";
        const websiteUrl = `${baseUrl}/dashboard/websites/${websiteId}`;
        const dashboardUrl = `${baseUrl}/dashboard`;

        // Plain text version
        const plainText = `
Your Website "${websiteName}" is Ready!

We're excited to let you know that your website has been successfully generated using our Claude 3.7 Sonnet model.

Website Details:
- Name: ${websiteName}
- Status: Live
- Generation Mode: Pro (Claude 3.7 Sonnet)

You can view your website here: ${websiteUrl}
Or go to your dashboard: ${dashboardUrl}

Next Steps:
1. Customize Your Content - Review all pages and update content to perfectly match your needs
2. Add Your Domain - Connect your custom domain for a professional web presence
3. Share Your Site - Promote your new website on social media and other channels

If you have any questions, contact us at support@rapidai.website

© 2024 RapidSite. All rights reserved.
`;

        // Render the email template to HTML
        const emailHtml = await render(WebsiteCompleteEmail({
            email: userEmail,
            websiteName,
            websiteUrl,
            dashboardUrl
        }));

        // Create message object
        const message = {
            senderAddress: "DoNotReply@rapidai.website",
            content: {
                subject: `Your website "${websiteName}" is now ready! - RapidSite Pro Generation Complete`,
                html: emailHtml,
                plainText
            },
            recipients: {
                to: [
                    {
                        address: userEmail,
                    },
                ],
            },
        };

        console.log('Sending website completion email with configuration:', {
            sender: message.senderAddress,
            recipient: userEmail,
            subject: message.content.subject,
            htmlLength: emailHtml.length
        });

        // Send the email
        const poller = await emailClient.beginSend(message);
        console.log('Email send initiated, waiting for completion...');
        const result = await poller.pollUntilDone();

        console.log('Website completion email sent successfully, result:', result);
        return true;
    } catch (error) {
        console.error("Failed to send website completion email:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            code: (error as any)?.code,
            response: (error as any)?.response
        });
        return false;
    }
} 