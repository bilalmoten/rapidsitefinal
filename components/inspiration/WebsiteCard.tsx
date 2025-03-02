import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, Copy, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebsiteCardProps {
  id: number;
  name: string;
  thumbnailUrl: string;
  industryType?: string;
  features?: string[];
  voteCount: number;
  cloneCount: number;
  isAuthenticated: boolean;
  hasVoted?: boolean;
  subdomain: string;
  onVoteChange?: (
    websiteId: number,
    hasVoted: boolean,
    newCount: number
  ) => void;
}

export default function WebsiteCard({
  id,
  name,
  thumbnailUrl,
  industryType,
  features = [],
  voteCount,
  cloneCount,
  isAuthenticated,
  hasVoted = false,
  subdomain,
  onVoteChange,
}: WebsiteCardProps) {
  const [votes, setVotes] = React.useState(voteCount);
  const [voted, setVoted] = React.useState(hasVoted);
  const [isCloning, setIsCloning] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleVote = async () => {
    if (!isAuthenticated) return;

    try {
      const supabase = createClient();

      if (voted) {
        // Remove vote
        const { error } = await supabase
          .from("website_votes")
          .delete()
          .match({ website_id: id });

        if (error) throw error;

        // Update website vote count
        await supabase.rpc("decrement_vote_count", { website_id: id });

        setVotes((prev) => prev - 1);
        setVoted(false);

        // Notify parent component
        if (onVoteChange) {
          onVoteChange(id, false, votes - 1);
        }
      } else {
        // Add vote
        const { error } = await supabase
          .from("website_votes")
          .insert({ website_id: id });

        if (error) throw error;

        // Update website vote count
        await supabase.rpc("increment_vote_count", { website_id: id });

        setVotes((prev) => prev + 1);
        setVoted(true);

        // Notify parent component
        if (onVoteChange) {
          onVoteChange(id, true, votes + 1);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Update local state when props change
  React.useEffect(() => {
    setVotes(voteCount);
    setVoted(hasVoted);
  }, [voteCount, hasVoted]);

  const handleClone = async () => {
    if (!isAuthenticated || isCloning) return;

    setIsCloning(true);
    try {
      const response = await fetch(`/api/inspiration/clone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = `/dashboard?cloned=${data.newWebsiteId}`;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error cloning:", error);
      alert("Failed to clone website. Please try again.");
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div
      className="group bg-card rounded-lg shadow-md overflow-hidden border border-border transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Link href={`/inspiration/${id}`}>
          <div className="w-full h-full relative overflow-hidden">
            <Image
              src={thumbnailUrl || "/placeholder.svg"}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              style={{
                transformOrigin: "top",
                transform: isHovered ? "translateY(-30%)" : "translateY(0%)",
                transition: "transform 4s ease-out",
              }}
            />
          </div>
        </Link>

        {industryType && (
          <Badge className="absolute top-3 left-3 bg-primary/80 hover:bg-primary">
            {industryType}
          </Badge>
        )}

        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Copy size={14} />
            <span>{cloneCount}</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Heart size={14} fill={voted ? "currentColor" : "none"} />
            <span>{votes}</span>
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium truncate">{name}</h3>
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Link href={`/inspiration/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex gap-2">
              <Button
                variant={voted ? "default" : "outline"}
                size="icon"
                onClick={handleVote}
                title={voted ? "Remove vote" : "Vote for this website"}
              >
                <Heart size={18} fill={voted ? "currentColor" : "none"} />
              </Button>

              <Button
                variant="default"
                size="icon"
                onClick={handleClone}
                disabled={isCloning}
                title="Clone this website"
              >
                <Copy size={18} />
              </Button>

              <Link
                href={`https://${subdomain}.rapidai.website`}
                target="_blank"
              >
                <Button variant="outline" size="icon" title="Visit Website">
                  <ExternalLink size={18} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled
                      className="cursor-not-allowed"
                    >
                      <Heart size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log in to vote</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled
                      className="cursor-not-allowed"
                    >
                      <Copy size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log in to clone this website</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Link
                href={`https://${subdomain}.rapidai.website`}
                target="_blank"
              >
                <Button variant="outline" size="icon" title="Visit Website">
                  <ExternalLink size={18} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
