"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Copy, Check, RefreshCw, Lock, Globe } from "lucide-react";
import { PlanType } from "@/lib/constants/plans";
import SettingsModal from "@/components/dashboard/SettingsModal";

interface DomainManagerProps {
  websiteId: string;
  userPlan: "free" | "pro" | "enterprise";
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
}

export function DomainManager({
  websiteId,
  userPlan,
  usage,
  user,
}: DomainManagerProps) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<any>(null);
  const [verificationDetails, setVerificationDetails] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchCurrentDomain();
  }, [websiteId]);

  const fetchCurrentDomain = async () => {
    try {
      const response = await fetch(`/api/domains?websiteId=${websiteId}`);
      const data = await response.json();
      if (data && data[0]) {
        setCurrentDomain(data[0]);
        setVerificationDetails(data[0].verification_data);
      }
    } catch (error) {
      console.error("Error fetching domain:", error);
    }
  };

  const addDomain = async () => {
    if (userPlan === "free") {
      toast.error(
        "Custom domains are only available for premium users. Please upgrade to add a custom domain."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, websiteId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCurrentDomain(data);
      setVerificationDetails(data.verification_data);
      setDomain("");
      toast.success("Domain added successfully! Please verify ownership.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeDomain = async () => {
    if (!currentDomain) return;

    setLoading(true);
    try {
      const response = await fetch("/api/domains", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: currentDomain.domain }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setCurrentDomain(null);
      setVerificationDetails(null);
      toast.success("Domain removed successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkVerification = async () => {
    if (!currentDomain) return;

    setLoading(true);
    try {
      const response = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: currentDomain.domain }),
      });

      const data = await response.json();

      if (data.misconfigured === false) {
        toast.success("Domain verified successfully!");
        await fetchCurrentDomain();
      } else {
        toast.info(
          "Domain verification pending. Please check your DNS settings."
        );
      }
    } catch (error: any) {
      console.error("Verification Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-[28px] font-medium text-white mb-6 flex items-center">
          <Globe className="w-6 h-6 mr-3 text-primary-main" />
          Custom Domain
        </h2>
        <p className="text-neutral-40 text-sm mb-6">
          Configure a custom domain for your website. Add your domain and follow
          the DNS configuration instructions.
        </p>

        {userPlan === "free" ? (
          <div className="border border-neutral-70 rounded-lg px-6 py-8 bg-[#0a0a0b40] backdrop-blur-sm text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary-main opacity-50" />
            <h3 className="text-[20px] font-medium text-white mb-2">
              Premium Feature
            </h3>
            <p className="text-neutral-40 text-sm mb-6">
              Custom domains are available for premium users only. Upgrade your
              plan to use this feature.
            </p>
            <Button
              onClick={() => setShowSettings(true)}
              className="bg-primary-main text-primary-foreground hover:bg-primary-main/90"
            >
              Upgrade Plan
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Enter your domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={loading}
                className="bg-transparent border-neutral-70 text-neutral-20 placeholder:text-neutral-60"
              />
              <Button
                onClick={addDomain}
                disabled={loading}
                className="bg-primary-main text-primary-foreground hover:bg-primary-main/90"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Add Domain
              </Button>
            </div>

            {currentDomain && (
              <div className="border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-20 text-sm mb-1">
                      Current Domain
                    </p>
                    <p className="text-primary-main text-[20px] font-medium">
                      {currentDomain.domain}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkVerification}
                      disabled={loading}
                      className="border-neutral-70 text-neutral-20 hover:bg-neutral-80/10"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        "Check Status"
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={removeDomain}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {verificationDetails && currentDomain?.status === "pending" && (
              <div className="space-y-4">
                <div className="border border-neutral-70 rounded-lg px-6 py-4 bg-[#0a0a0b40] backdrop-blur-sm">
                  <h3 className="text-neutral-20 text-sm mb-1">
                    DNS Configuration Required
                  </h3>
                  <p className="text-neutral-40 text-sm">
                    Add these DNS records to your domain's DNS configuration. It
                    may take up to 48 hours for DNS changes to propagate.
                  </p>
                </div>

                <div className="border border-neutral-70 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-70 hover:bg-neutral-80/10">
                        <TableHead className="text-neutral-20">Type</TableHead>
                        <TableHead className="text-neutral-20">Name</TableHead>
                        <TableHead className="text-neutral-20">Value</TableHead>
                        <TableHead className="w-[100px] text-neutral-20">
                          Copy
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-neutral-70 hover:bg-neutral-80/10">
                        <TableCell className="text-neutral-20">A</TableCell>
                        <TableCell className="text-neutral-20">@</TableCell>
                        <TableCell className="font-mono text-sm text-neutral-20">
                          76.76.21.21
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("76.76.21.21", "a")}
                            className="text-neutral-20 hover:text-primary-main hover:bg-transparent"
                          >
                            {copied === "a" ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        usage={usage}
        user={user}
        defaultTab="subscription"
      />
    </>
  );
}
