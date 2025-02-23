import { EmailClient } from "@azure/communication-email";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

// Initialize the Email Client
const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING || "");

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const { data: existingSubscriber } = await supabase
            .from("newsletter_subscribers")
            .select("id, status")
            .eq("email", email)
            .single();

        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return NextResponse.json(
                    { message: "You're already subscribed!" },
                    { status: 200 }
                );
            } else {
                // Reactivate subscription
                const { error } = await supabase
                    .from("newsletter_subscribers")
                    .update({ status: 'active' })
                    .eq("id", existingSubscriber.id);

                if (error) throw error;

                return NextResponse.json(
                    { message: "Welcome back! Your subscription has been reactivated." },
                    { status: 200 }
                );
            }
        }

        // Add new subscriber
        const { error: dbError } = await supabase
            .from("newsletter_subscribers")
            .insert([{ email, status: 'active' }]);

        if (dbError) {
            console.error("Database error:", dbError);
            throw dbError;
        }

        // Send welcome email
        try {
            console.log('Attempting to send email...');

            const plainText = `Welcome to AI Website Builder Newsletter!

Thank you for subscribing to our newsletter. We're excited to share updates about:
- New features and improvements
- Tips and tricks for web development
- AI technology insights
- Industry news and trends

Best regards,
The AI Website Builder Team`;

            // Render the email template to HTML
            const emailHtml = await render(WelcomeEmail({ email }));
            console.log('Generated HTML:', emailHtml.substring(0, 100));

            const message = {
                senderAddress: "DoNotReply@rapidai.website",
                content: {
                    subject: "Welcome to AI Website Builder Newsletter!",
                    html: emailHtml,
                    plainText
                },
                recipients: {
                    to: [
                        {
                            address: email,
                        },
                    ],
                },
            };

            console.log('Sending email with configuration:', {
                sender: message.senderAddress,
                recipient: email,
                subject: message.content.subject,
                htmlLength: emailHtml.length
            });

            const poller = await emailClient.beginSend(message);
            console.log('Email send initiated, waiting for completion...');
            const result = await poller.pollUntilDone();

            console.log('Email sent successfully, full result:', result);
        } catch (emailError: any) {
            console.error("Failed to send welcome email:", emailError);
            console.error("Error details:", {
                message: emailError.message,
                code: emailError.code,
                response: emailError.response
            });
            // Don't throw error here - we still want to return success even if email fails
        }

        return NextResponse.json(
            { message: "Thank you for subscribing!" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Newsletter signup error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe. Please try again later." },
            { status: 500 }
        );
    }
} 