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
import {
  PLAN_LIMITS,
  PlanType,
  LEMON_VARIANT_IDS,
  VariantId,
} from "@/lib/constants/plans";
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
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: {
    websitesActive: number;
    websitesGenerated: number;
    aiEditsCount: number;
    plan: PlanType;
    subscription_status?: string;
    subscription_id?: string;
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
    name: "Free",
    price: "$0/month",
    features: [
      "1 website",
      "10 AI edits",
      "3 website generations",
      "Email support",
    ],
    current: true,
    variantId: null,
  },
  {
    name: "Pro",
    price: "$9.99/month",
    yearlyPrice: "$89.99/year",
    features: [
      "5 websites",
      "100 AI edits",
      "20 website generations",
      "Priority support",
    ],
    current: false,
    variantId: LEMON_VARIANT_IDS.pro_monthly,
    yearlyVariantId: LEMON_VARIANT_IDS.pro_yearly,
  },
  {
    name: "Enterprise",
    price: "$39.99/month",
    yearlyPrice: "$359.99/year",
    features: [
      "Unlimited websites",
      "Unlimited AI edits",
      "Unlimited generations",
      "24/7 support",
      "Custom domain support",
    ],
    current: false,
    variantId: LEMON_VARIANT_IDS.pro_max_monthly,
    yearlyVariantId: LEMON_VARIANT_IDS.pro_max_yearly,
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
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

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

  const handleUpgrade = async (variantId: string) => {
    try {
      const response = await fetch("/api/subscription/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast.error("Failed to start upgrade process");
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
                <h3 className="font-semibold">Subscription Details</h3>
              </div>

              {/* Current Plan Status */}
              <div className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium">Current Plan</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {usage.plan}
                    </p>
                  </div>
                  <Badge
                    variant={
                      usage.subscription_status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {usage.subscription_status === "active"
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
                {usage.subscription_id &&
                  usage.subscription_status === "active" && (
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      disabled={isLoadingPortal}
                      onClick={async () => {
                        try {
                          setIsLoadingPortal(true);
                          const response = await fetch(
                            "/api/subscription/get-portal-url"
                          );
                          if (!response.ok)
                            throw new Error("Failed to get portal URL");
                          const { url } = await response.json();
                          window.open(url, "_blank");
                        } catch (error) {
                          console.error("Error getting portal URL:", error);
                          toast.error("Failed to open billing portal");
                        } finally {
                          setIsLoadingPortal(false);
                        }
                      }}
                    >
                      <CreditCard
                        className={cn(
                          "h-4 w-4 mr-2",
                          isLoadingPortal && "animate-pulse"
                        )}
                      />
                      {isLoadingPortal
                        ? "Opening Portal..."
                        : "Manage Subscription"}
                    </Button>
                  )}
              </div>

              {/* Billing Period Toggle */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span
                  className={cn(
                    "text-sm",
                    !isYearly && "text-primary font-medium"
                  )}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    isYearly ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      isYearly ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-sm",
                    isYearly && "text-primary font-medium"
                  )}
                >
                  Yearly
                </span>
                <span className="text-sm text-green-500 font-medium ml-1">
                  (Save 25%)
                </span>
              </div>

              {/* Available Plans */}
              <div
                className={cn(
                  "grid gap-6",
                  usage.plan === "free"
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2 max-w-3xl mx-auto"
                )}
              >
                {plans
                  .filter(
                    (plan) => usage.plan === "free" || plan.name !== "Free"
                  )
                  .map((plan) => (
                    <div
                      key={plan.name}
                      className={cn(
                        "border rounded-lg p-4 space-y-4",
                        usage.plan === plan.name.toLowerCase() &&
                          "ring-2 ring-blue-500"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {isYearly
                              ? plan.yearlyPrice || plan.price
                              : plan.price}
                          </p>
                        </div>
                        {usage.plan === plan.name.toLowerCase() ? (
                          <Badge>Current Plan</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const variantId = isYearly
                                ? plan.yearlyVariantId
                                : plan.variantId;
                              variantId && handleUpgrade(variantId);
                            }}
                            disabled={
                              (!isYearly && !plan.variantId) ||
                              (isYearly && !plan.yearlyVariantId) ||
                              (usage.plan !== "free" && plan.name === "Free")
                            }
                          >
                            {plan.name === "Free" ? "Downgrade" : "Upgrade"}
                          </Button>
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

              {/* Billing History */}
              {usage.plan !== "free" && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium mb-2">Billing & Invoices</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your billing history and download invoices
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoadingPortal}
                    onClick={async () => {
                      try {
                        setIsLoadingPortal(true);
                        const response = await fetch(
                          "/api/subscription/get-portal-url"
                        );
                        if (!response.ok)
                          throw new Error("Failed to get portal URL");
                        const { url } = await response.json();
                        window.open(url, "_blank");
                      } catch (error) {
                        console.error("Error getting portal URL:", error);
                        toast.error("Failed to open billing portal");
                      } finally {
                        setIsLoadingPortal(false);
                      }
                    }}
                  >
                    <CreditCard
                      className={cn(
                        "h-4 w-4 mr-2",
                        isLoadingPortal && "animate-pulse"
                      )}
                    />
                    {isLoadingPortal
                      ? "Opening Portal..."
                      : "View Billing History"}
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
                        const siteUrl =
                          process.env.NEXT_PUBLIC_SITE_URL ||
                          "https://aiwebsitebuilder.tech";

                        await supabase.auth.resetPasswordForEmail(
                          user?.email || "",
                          {
                            redirectTo: `${siteUrl}/auth/callback?type=recovery&email=${user?.email}`,
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
