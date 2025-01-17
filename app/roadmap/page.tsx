"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  ThumbsUp,
  Check,
  Clock,
  Hammer,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const roadmapFeatures = [
  {
    title: "Custom Domain Support",
    description:
      "Connect your own domain to your website for a professional branded experience",
    status: "completed",
    launchDate: "January 2025",
  },
  {
    title: "Promotional Banner System",
    description:
      "Smart promotional banners for free plan websites to help grow our community",
    status: "completed",
    launchDate: "January 2025",
  },
  {
    title: "Website Analytics",
    description: "Track website performance and visitor insights",
    status: "in_progress",
    eta: "February 2025",
  },
  {
    title: "Mobile Responsiveness",
    description: "Enhanced mobile experience across all pages",
    status: "in_progress",
    eta: "February 2025",
  },
  {
    title: "Voice Input for Chat",
    description: "Speak to create and edit your websites",
    status: "in_progress",
    eta: "March 2025",
  },
  {
    title: "Interactive Documentation",
    description: "Step-by-step guides with interactive examples",
    status: "planned",
    eta: "March 2025",
  },
  {
    title: "Video Tutorials",
    description: "Comprehensive video guides for all features",
    status: "planned",
    eta: "March 2025",
  },
  {
    title: "AI Chat Support",
    description: "Get instant help from our AI assistant",
    status: "planned",
    eta: "April 2025",
  },
  {
    title: "Live Chat Support",
    description: "Direct support from our team",
    status: "planned",
    eta: "April 2025",
  },
  {
    title: "Feature Walkthroughs",
    description: "Interactive tutorials for each feature",
    status: "planned",
    eta: "April 2025",
  },
  {
    title: "Social Media Integration",
    description: "Connect and share your websites on social platforms",
    status: "planned",
    eta: "May 2025",
  },
  {
    title: "Contact Forms & Lead Generation",
    description: "Built-in contact forms with lead management",
    status: "planned",
    eta: "May 2025",
  },
  {
    title: "Blog System",
    description: "Create and manage blog posts for your website",
    status: "planned",
    eta: "June 2025",
  },
  {
    title: "Newsletter Integration",
    description: "Built-in newsletter subscription and management",
    status: "planned",
    eta: "June 2025",
  },
  {
    title: "Calendar & Booking System",
    description: "Appointment scheduling and booking functionality",
    status: "planned",
    eta: "June 2025",
  },
  {
    title: "Export Website Code",
    description: "Download your website's source code",
    status: "completed",
    launchDate: "December 2024",
  },
  {
    title: "Google Sign In",
    description: "Quick and secure login with Google",
    status: "completed",
    launchDate: "December 2024",
  },
  {
    title: "Password Reset Flow",
    description: "Secure password recovery system",
    status: "completed",
    launchDate: "December 2024",
  },
];

interface CommunityFeature {
  id: string;
  title: string;
  description: string;
  status: string;
  votes_count: number;
  created_by: string;
  has_voted?: boolean;
}

const FeatureCard = ({
  feature,
  isRoadmap = false,
  onVote,
}: {
  feature: any;
  isRoadmap?: boolean;
  onVote?: (featureId: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-border"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          {isRoadmap ? (
            <span className="text-sm text-muted-foreground">
              {feature.status === "completed"
                ? `Completed: ${feature.launchDate}`
                : `ETA: ${feature.eta}`}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={`text-muted-foreground hover:text-primary ${
                feature.has_voted ? "text-primary" : ""
              }`}
              onClick={() => onVote?.(feature.id)}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-1 ${
                  feature.has_voted ? "fill-current" : ""
                }`}
              />
              {feature.votes_count}
            </Button>
          )}
        </div>
        <StatusBadge status={feature.status} />
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    planned: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    suggested: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }[status];

  const label = {
    completed: "COMPLETED",
    in_progress: "IN PROGRESS",
    planned: "PLANNED",
    suggested: "SUGGESTED",
  }[status];

  return (
    <Badge variant="outline" className={`${styles} font-medium`}>
      {label}
    </Badge>
  );
};

const ColumnHeader = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) => (
  <div className={`p-4 rounded-t-lg ${color}`}>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <Badge
        variant="secondary"
        className="bg-white/10 text-white border-white/20"
      >
        {count}
      </Badge>
    </div>
  </div>
);

export default function RoadmapPage() {
  const [communityFeatures, setCommunityFeatures] = useState<
    CommunityFeature[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [showAllRoadmap, setShowAllRoadmap] = useState(false);
  const [showAllCommunity, setShowAllCommunity] = useState(false);

  // Helper function to limit items
  const limitItems = (items: any[], limit: number) => {
    return items.slice(0, limit);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        // Fetch features and votes
        const { data: features, error: featuresError } = await supabase
          .from("feature_requests")
          .select("*")
          .eq("status", "suggested")
          .order("votes_count", { ascending: false });

        if (featuresError) {
          console.error("Error details:", featuresError);
          throw new Error(featuresError.message || "Failed to fetch features");
        }

        if (user) {
          // Fetch user's votes
          const { data: votes, error: votesError } = await supabase
            .from("feature_votes")
            .select("feature_id")
            .eq("user_id", user.id);

          if (votesError) throw votesError;

          const votedFeatureIds = new Set(votes?.map((v) => v.feature_id));

          // Mark features that user has voted on
          features?.forEach((feature) => {
            feature.has_voted = votedFeatureIds.has(feature.id);
          });
        }

        setCommunityFeatures(features || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load features");
        toast.error(err.message || "Failed to load features");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = async (featureId: string) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    const feature = communityFeatures.find((f) => f.id === featureId);
    if (!feature) return;

    try {
      if (feature.has_voted) {
        // Remove vote
        const { error: voteError } = await supabase
          .from("feature_votes")
          .delete()
          .eq("feature_id", featureId)
          .eq("user_id", user.id);

        if (voteError) throw voteError;

        // Update vote count
        const { error: updateError } = await supabase
          .from("feature_requests")
          .update({ votes_count: feature.votes_count - 1 })
          .eq("id", featureId);

        if (updateError) throw updateError;

        // Update local state and sort
        setCommunityFeatures((prev) =>
          [
            ...prev.map((f) =>
              f.id === featureId
                ? { ...f, votes_count: f.votes_count - 1, has_voted: false }
                : f
            ),
          ].sort((a, b) => b.votes_count - a.votes_count)
        );
      } else {
        // Add vote
        const { error: voteError } = await supabase
          .from("feature_votes")
          .insert([{ feature_id: featureId, user_id: user.id }]);

        if (voteError) throw voteError;

        // Update vote count
        const { error: updateError } = await supabase
          .from("feature_requests")
          .update({ votes_count: feature.votes_count + 1 })
          .eq("id", featureId);

        if (updateError) throw updateError;

        // Update local state and sort
        setCommunityFeatures((prev) =>
          [
            ...prev.map((f) =>
              f.id === featureId
                ? { ...f, votes_count: f.votes_count + 1, has_voted: true }
                : f
            ),
          ].sort((a, b) => b.votes_count - a.votes_count)
        );
      }
    } catch (error: any) {
      console.error("Error handling vote:", error);
      toast.error(error.message || "Failed to update vote");
    }
  };

  const handleSuggestFeature = async () => {
    if (!user) {
      toast.error("Please sign in to suggest features");
      return;
    }

    if (!newFeature.title.trim() || !newFeature.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("feature_requests")
        .insert([
          {
            title: newFeature.title.trim(),
            description: newFeature.description.trim(),
            status: "suggested",
            votes_count: 0,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCommunityFeatures((prev) => [...prev, data]);
      setShowSuggestDialog(false);
      setNewFeature({ title: "", description: "" });
      toast.success("Feature suggested successfully!");
    } catch (error: any) {
      console.error("Error suggesting feature:", error);
      toast.error(error.message || "Failed to suggest feature");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Product Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track our progress and help shape the future of RapidSite
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Official Roadmap Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-semibold">Official Roadmap</h2>
              <Separator className="flex-1" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {["planned", "in_progress", "completed"].map((status) => {
                const features = roadmapFeatures.filter(
                  (f) => f.status === status
                );
                const displayFeatures = showAllRoadmap
                  ? features
                  : limitItems(features, 2);

                return (
                  <div key={status} className="space-y-4">
                    <ColumnHeader
                      title={
                        status === "planned"
                          ? "Planned"
                          : status === "in_progress"
                          ? "In Progress"
                          : "Completed"
                      }
                      count={features.length}
                      color={`bg-gradient-to-br ${
                        status === "planned"
                          ? "from-orange-500 to-orange-600"
                          : status === "in_progress"
                          ? "from-blue-500 to-blue-600"
                          : "from-green-500 to-green-600"
                      }`}
                    />
                    <div className="space-y-4">
                      {displayFeatures.map((feature) => (
                        <FeatureCard
                          key={feature.title}
                          feature={feature}
                          isRoadmap
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {!showAllRoadmap && (
              <div className="relative mt-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background"
                    onClick={() => setShowAllRoadmap(true)}
                  >
                    View All Features
                  </Button>
                </div>
              </div>
            )}
            {showAllRoadmap && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllRoadmap(false)}
                >
                  Show Less
                </Button>
              </div>
            )}
          </section>

          {/* Community Features Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-semibold">Community Features</h2>
              <Separator className="flex-1" />
              <Button onClick={() => setShowSuggestDialog(true)}>
                Suggest Feature
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse"
                  >
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : communityFeatures.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No feature suggestions yet. Be the first to suggest one!</p>
              </div>
            ) : (
              <div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(showAllCommunity
                    ? communityFeatures
                    : limitItems(communityFeatures, 6)
                  ).map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      onVote={handleVote}
                    />
                  ))}
                </div>
                {communityFeatures.length > 6 && !showAllCommunity && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCommunity(true)}
                    >
                      View {communityFeatures.length - 6} more suggestions...
                    </Button>
                  </div>
                )}
                {showAllCommunity && (
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCommunity(false)}
                    >
                      Show Less
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog open={showSuggestDialog} onOpenChange={setShowSuggestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggest a Feature</DialogTitle>
            <DialogDescription>
              What would you like to see in RapidSite? Your suggestion will be
              visible to the community.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSuggestFeature();
            }}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Feature Title</label>
              <Input
                placeholder="Enter a clear, concise title"
                value={newFeature.title}
                onChange={(e) =>
                  setNewFeature((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the feature and its benefits"
                value={newFeature.description}
                onChange={(e) =>
                  setNewFeature((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSuggestDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  </>
                ) : (
                  "Submit Suggestion"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
