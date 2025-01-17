import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const token = process.env.VERCEL_API_TOKEN;
    try {
        const { domain } = await req.json();
        const response = await fetch(`https://api.vercel.com/v6/domains/${domain}/config`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "get"
        });

        const data = await response.json();
        console.log('Domain config response:', data);

        // If domain is not misconfigured, update status in database
        if (data.misconfigured === false) {
            const supabase = await createClient();
            await supabase
                .from('custom_domains')
                .update({
                    status: 'active',
                    verified_at: new Date().toISOString()
                })
                .eq('domain', domain);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Domain verification error:', error);
        return NextResponse.json(
            { error: "Error verifying domain" },
            { status: 500 }
        );
    }
} 