import WelcomeEmail from "@/emails/WelcomeEmail";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const supabase = createClient();
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
            const data = await resend.emails.send({
                from: 'AI Website Builder <newsletter@aiwebsitebuilder.tech>',
                to: email,
                subject: 'Welcome to AI Website Builder Newsletter!',
                replyTo: 'support@aiwebsitebuilder.tech',
                react: WelcomeEmail({ email }),
                // html: `
                //     <h1>Welcome to AI Website Builder!</h1>
                //     <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates in AI-powered web development with you.</p>
                //     <p>You'll receive updates about:</p>
                //     <ul>
                //         <li>New features and improvements</li>
                //         <li>Tips and tricks for web development</li>
                //         <li>AI technology insights</li>
                //         <li>Industry news and trends</li>
                //     </ul>
                //     <p>Visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog">blog</a> for more great content!</p>
                // `
            });
            console.log('Email sent successfully:', data);
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