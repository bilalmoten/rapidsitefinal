import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { websiteId } = await request.json();

    if (!websiteId) {
        return NextResponse.json({ error: "Website ID is required" }, { status: 400 });
    }

    try {
        // Check if user has already voted
        const { data: existingVote, error: checkError } = await supabase
            .from("website_votes")
            .select("*")
            .eq("website_id", websiteId)
            .eq("user_id", user.id)
            .single();

        if (checkError && checkError.code !== "PGRST116") {
            console.error("Error checking vote:", checkError);
            return NextResponse.json({ error: "Failed to check vote" }, { status: 500 });
        }

        let action;

        if (existingVote) {
            // Remove vote
            const { error: deleteError } = await supabase
                .from("website_votes")
                .delete()
                .eq("website_id", websiteId)
                .eq("user_id", user.id);

            if (deleteError) throw deleteError;

            // Decrement vote count
            const { error: updateError } = await supabase.rpc('decrement_vote_count', { website_id: websiteId });

            if (updateError) throw updateError;

            action = "removed";
        } else {
            // Add vote
            const { error: insertError } = await supabase
                .from("website_votes")
                .insert({ website_id: websiteId, user_id: user.id });

            if (insertError) throw insertError;

            // Increment vote count
            const { error: updateError } = await supabase.rpc('increment_vote_count', { website_id: websiteId });

            if (updateError) throw updateError;

            action = "added";
        }

        // Get updated count
        const { data: website, error: fetchError } = await supabase
            .from("websites")
            .select("vote_count")
            .eq("id", websiteId)
            .single();

        if (fetchError) throw fetchError;

        return NextResponse.json({
            success: true,
            action,
            voteCount: website.vote_count
        });
    } catch (error) {
        console.error("Error handling vote:", error);
        return NextResponse.json({ error: "Failed to process vote" }, { status: 500 });
    }
}

// Get vote status for a user
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get("websiteId");

    if (!websiteId) {
        return NextResponse.json({ error: "Website ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ hasVoted: false, isAuthenticated: false });
    }

    try {
        const { data, error } = await supabase
            .from("website_votes")
            .select("*")
            .eq("website_id", websiteId)
            .eq("user_id", user.id)
            .single();

        if (error && error.code !== "PGRST116") {
            throw error;
        }

        return NextResponse.json({
            hasVoted: !!data,
            isAuthenticated: true
        });
    } catch (error) {
        console.error("Error checking vote status:", error);
        return NextResponse.json({ error: "Failed to check vote status" }, { status: 500 });
    }
} 