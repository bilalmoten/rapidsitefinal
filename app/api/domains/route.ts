// app/api/domains/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { VercelDomainAPI } from "@/utils/vercel";

export async function POST(req: Request) {
    try {
        const { domain, websiteId } = await req.json();
        const supabase = await createClient();
        const vercel = new VercelDomainAPI();

        // Check if domain is already registered
        const { data: existing } = await supabase
            .from('custom_domains')
            .select()
            .eq('domain', domain)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Domain already registered' },
                { status: 400 }
            );
        }

        // Add domain to Vercel
        const vercelResponse = await vercel.addDomain(domain);
        console.log('Vercel addDomain response:', vercelResponse);

        if (vercelResponse.error) {
            return NextResponse.json(
                { error: vercelResponse.error.message },
                { status: 400 }
            );
        }

        // Get the verification token directly from the addDomain response
        const verificationToken = `vercel-domain-verification=${vercelResponse.verificationToken}`;
        console.log('Verification token:', verificationToken);

        // Store in database
        const { data, error } = await supabase
            .from('custom_domains')
            .insert({
                domain,
                website_id: websiteId,
                verification_data: {
                    verification: [{
                        type: 'TXT',
                        name: '@',
                        value: verificationToken
                    }]
                },
                verification_type: 'txt',
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            // Cleanup Vercel if DB fails
            await vercel.removeDomain(domain);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const websiteId = url.searchParams.get('websiteId');

    if (!websiteId) {
        return NextResponse.json(
            { error: 'Website ID is required' },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('custom_domains')
        .select('*')
        .eq('website_id', websiteId);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data);
}

export async function DELETE(req: Request) {
    try {
        const { domain } = await req.json();
        const supabase = await createClient();
        const vercel = new VercelDomainAPI();

        // Remove from Vercel
        await vercel.removeDomain(domain);

        // Remove from database
        const { error } = await supabase
            .from('custom_domains')
            .delete()
            .eq('domain', domain);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}