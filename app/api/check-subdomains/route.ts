import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("websites")
            .select("subdomain");

        if (error) {
            console.error("Error fetching subdomains:", error);
            return NextResponse.json(
                { error: "Failed to fetch subdomains" },
                { status: 500 }
            );
        }

        const subdomains = data.map(item => item.subdomain);

        return NextResponse.json({ subdomains });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 