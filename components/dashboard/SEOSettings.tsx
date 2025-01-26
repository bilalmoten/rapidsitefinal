"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface SEOSettingsProps {
  websiteId: string;
  initialSeoIndexed: boolean;
  initialIsPublic: boolean;
}

export function SEOSettings({
  websiteId,
  initialSeoIndexed,
  initialIsPublic,
}: SEOSettingsProps) {
  const [seoIndexed, setSeoIndexed] = useState(initialSeoIndexed);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const supabase = createClient();

  const handleSeoIndexedChange = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ seo_indexed: checked })
        .eq("id", websiteId);

      if (error) throw error;

      setSeoIndexed(checked);
      toast.success("Search engine indexing settings updated");
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      toast.error("Failed to update search engine indexing settings");
      setSeoIndexed(!checked); // Revert on error
    }
  };

  const handleVisibilityChange = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ is_public: checked })
        .eq("id", websiteId);

      if (error) throw error;

      setIsPublic(checked);
      toast.success("Website visibility settings updated");
    } catch (error) {
      console.error("Error updating visibility settings:", error);
      toast.error("Failed to update website visibility settings");
      setIsPublic(!checked); // Revert on error
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-[28px] font-medium text-white mb-6 flex items-center">
        <Search className="w-6 h-6 mr-3 text-primary-main" />
        SEO & Visibility
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
          <div>
            <p className="text-neutral-20 text-sm mb-1">
              Search Engine Indexing
            </p>
            <p className="text-neutral-40 text-sm">
              Allow search engines to index your website
            </p>
          </div>
          <Switch
            checked={seoIndexed}
            onCheckedChange={handleSeoIndexedChange}
          />
        </div>
        <div className="flex items-center justify-between border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
          <div>
            <p className="text-neutral-20 text-sm mb-1">Website Visibility</p>
            <p className="text-neutral-40 text-sm">
              Make your website public or private
            </p>
          </div>
          <Switch checked={isPublic} onCheckedChange={handleVisibilityChange} />
        </div>
      </div>
    </div>
  );
}
