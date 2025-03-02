import React from "react";
import { ChevronLeft, ChevronRight, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CloneButton from "./CloneButton";

export interface FeaturedWebsite {
  id: number;
  website_name: string;
  thumbnail_url: string;
  industry_type: string;
  vote_count: number;
  clone_count: number;
  subdomain: string;
}

interface FeaturedBannerProps {
  featuredWebsites: FeaturedWebsite[];
  isAuthenticated?: boolean;
}

export default function FeaturedBanner({
  featuredWebsites,
  isAuthenticated = false,
}: FeaturedBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === featuredWebsites.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredWebsites.length - 1 : prev - 1
    );
  };

  // Auto advance carousel
  React.useEffect(() => {
    if (featuredWebsites.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredWebsites.length, currentIndex]);

  if (!featuredWebsites.length) return null;

  return (
    <div className="mb-10 overflow-hidden rounded-lg relative bg-muted/30 border border-border">
      {/* Carousel Controls */}
      {featuredWebsites.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
            onClick={prevSlide}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
            onClick={nextSlide}
          >
            <ChevronRight size={16} />
          </Button>
        </>
      )}

      {/* Carousel Track */}
      <div
        className="flex transition-transform duration-500 ease-out h-[400px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredWebsites.map((website) => (
          <div
            key={website.id}
            className="min-w-full flex flex-col md:flex-row"
          >
            <div className="relative w-full md:w-2/3 h-48 md:h-full">
              <Image
                src={website.thumbnail_url || "/placeholder.svg"}
                alt={website.website_name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
              {website.industry_type && (
                <Badge className="absolute top-4 left-4 bg-primary/80 hover:bg-primary">
                  {website.industry_type}
                </Badge>
              )}
            </div>
            <div className="p-6 flex flex-col justify-between w-full md:w-1/3 bg-card">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {website.website_name}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Featured website design, showcasing the best of what our
                  platform can create.
                </p>

                <div className="flex gap-4 mb-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {website.vote_count}
                    </div>
                    <div className="text-xs text-muted-foreground">Votes</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {website.clone_count}
                    </div>
                    <div className="text-xs text-muted-foreground">Clones</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Link href={`/inspiration/${website.id}`} className="flex-1">
                    <Button className="w-full">View Details</Button>
                  </Link>

                  <Link
                    href={`https://${website.subdomain}.rapidai.website`}
                    target="_blank"
                  >
                    <Button variant="outline" size="icon" title="Visit Website">
                      <ExternalLink size={16} />
                    </Button>
                  </Link>
                </div>

                {isAuthenticated ? (
                  <CloneButton
                    websiteId={website.id}
                    websiteName={website.website_name}
                    isAuthenticated={isAuthenticated}
                    className="w-full"
                  />
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="w-full" disabled>
                          <Copy size={16} className="mr-2" />
                          Clone Website
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Log in to clone this website</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      {featuredWebsites.length > 1 && (
        <div className="flex justify-center gap-2 absolute bottom-4 left-0 right-0">
          {featuredWebsites.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === index
                  ? "bg-primary w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
