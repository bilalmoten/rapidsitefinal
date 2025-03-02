import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Heart, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InteractivePreview from "@/components/inspiration/InteractivePreview";
import ColorPalette from "@/components/inspiration/ColorPalette";
import CloneButton from "@/components/inspiration/CloneButton";

export const dynamic = "force-dynamic";
export default async function InspirationDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const params = await props.params;
  const websiteId = parseInt(params.id);

  if (isNaN(websiteId)) {
    return notFound();
  }
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Get website details
  const { data: website, error } = await supabase
    .from("websites")
    .select("*")
    .eq("id", websiteId)
    .single();

  if (error || !website) {
    console.error("Error fetching website:", error);
    return notFound();
  }

  // Check if user has voted for this website
  let hasVoted = false;

  if (isAuthenticated) {
    const { data: vote, error: voteError } = await supabase
      .from("website_votes")
      .select("*")
      .eq("website_id", websiteId)
      .eq("user_id", user.id)
      .single();

    if (!voteError && vote) {
      hasVoted = true;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/inspiration"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Inspiration Gallery
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{website.website_name}</h1>
            {website.website_description && (
              <p className="text-muted-foreground">
                {website.website_description}
              </p>
            )}
          </div>

          <InteractivePreview
            websiteId={website.id}
            websiteName={website.website_name}
            subdomain={website.subdomain}
          />
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-lg border border-border p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Website Details</h2>
              {website.is_featured && (
                <Badge
                  variant="default"
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Featured
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Votes</div>
                <div className="flex items-center">
                  <Heart
                    size={16}
                    className="mr-1.5"
                    fill={hasVoted ? "currentColor" : "none"}
                  />
                  <span className="text-lg font-medium">
                    {website.vote_count}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Clones</div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1.5" />
                  <span className="text-lg font-medium">
                    {website.clone_count}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-lg font-medium">
                  {new Date(website.created_at).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Updated</div>
                <div className="text-lg font-medium">
                  {new Date(website.last_updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {website.industry_type && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Industry
                  </div>
                  <Badge variant="secondary">{website.industry_type}</Badge>
                </div>
              )}

              {website.features_used && website.features_used.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Features
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {website.features_used.map(
                      (feature: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {website.categories && website.categories.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {website.categories.map(
                      (category: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {category}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <CloneButton
                websiteId={website.id}
                websiteName={website.website_name}
                isAuthenticated={isAuthenticated}
              />

              <Link
                href={`https://${website.subdomain}.rapidai.website`}
                target="_blank"
              >
                <Button variant="outline" className="w-full">
                  Visit Website
                </Button>
              </Link>
            </div>
          </div>

          {website.color_palette && (
            <ColorPalette colors={website.color_palette} />
          )}
        </div>
      </div>
    </div>
  );
}
