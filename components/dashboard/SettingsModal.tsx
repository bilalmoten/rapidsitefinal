"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import {
  Crown,
  Zap,
  Upload,
  User,
  Mail,
  Key,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { uploadAvatar } from "@/utils/profile-manager";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: {
    websitesActive: number;
    websitesGenerated: number;
    aiEditsCount: number;
    plan: PlanType;
  };
  user?: {
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  onProfileUpdate?: () => Promise<void>;
}

const plans = [
  {
    name: "Pro",
    price: "$19/month",
    features: [
      "5 websites",
      "100 AI edits",
      "20 website generations",
      "Priority support",
    ],
    current: false,
  },
  {
    name: "Enterprise",
    price: "$49/month",
    features: [
      "Unlimited websites",
      "Unlimited AI edits",
      "Unlimited generations",
      "24/7 support",
      "Custom domain support",
    ],
    current: false,
  },
];

export default function SettingsModal({
  isOpen,
  onClose,
  usage,
  user,
  onProfileUpdate,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("usage");
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
  });

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Call the onProfileUpdate callback to refresh data
      if (onProfileUpdate) {
        await onProfileUpdate();
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadAvatar(file);
      if (publicUrl && onProfileUpdate) {
        await onProfileUpdate(); // Refresh the data
      }
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Current Usage</h3>
                <Badge
                  variant={usage.plan === "free" ? "secondary" : "default"}
                >
                  {usage.plan.toUpperCase()} PLAN
                </Badge>
              </div>
              <div className="space-y-4">
                <UsageBar
                  icon="website"
                  label="Active Websites"
                  current={usage.websitesActive}
                  limit={PLAN_LIMITS[usage.plan].websites}
                />
                <UsageBar
                  icon="generated"
                  label="Websites Generated"
                  current={usage.websitesGenerated}
                  limit={PLAN_LIMITS[usage.plan].websitesGenerated}
                />
                <UsageBar
                  icon="ai"
                  label="AI Edits"
                  current={usage.aiEditsCount}
                  limit={PLAN_LIMITS[usage.plan].aiEdits}
                />
              </div>
              {usage.plan === "free" && (
                <div className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => setActiveTab("subscription")}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Available Plans</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {plan.price}
                        </p>
                      </div>
                      {plan.current ? (
                        <Badge>Current Plan</Badge>
                      ) : (
                        <Button variant="outline">Select</Button>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {usage.plan !== "free" && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-2">Billing History</h4>
                  <p className="text-sm text-muted-foreground">
                    View and download your billing history
                  </p>
                  <Button variant="outline" className="mt-2">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="p-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="relative">
                      <Input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleAvatarUpload}
                        accept="image/*"
                      />
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Avatar
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder={user?.first_name || "Enter first name"}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder={user?.last_name || "Enter last name"}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      value={user?.email}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed directly. Contact support if
                      needed.
                    </p>
                  </div>

                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Security</h4>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={async () => {
                        const supabase = createClient();
                        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
                        await supabase.auth.resetPasswordForEmail(
                          user?.email || "",
                          {
                            redirectTo: `${siteUrl}/auth/callback`,
                          }
                        );
                        toast.success("Password reset email sent");
                      }}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
