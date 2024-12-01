"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { UsageBar } from "@/components/ui/usage-bar";
import { PLAN_LIMITS, PlanType } from "@/lib/constants/plans";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: {
    websitesActive: number;
    websitesGenerated: number;
    aiEditsCount: number;
    plan: PlanType;
  };
}

export default function SettingsModal({
  isOpen,
  onClose,
  usage,
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Current Usage</h3>
              <div className="space-y-4">
                <UsageBar
                  label="Active Websites"
                  current={usage.websitesActive}
                  limit={PLAN_LIMITS[usage.plan].websites}
                />
                <UsageBar
                  label="AI Edits"
                  current={usage.aiEditsCount}
                  limit={PLAN_LIMITS[usage.plan].aiEdits}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Add other tabs content */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
