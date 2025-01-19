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
import { Copy, Check, RefreshCw, Lock } from "lucide-react";
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

      // Check if misconfigured is false, indicating successful verification
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
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Domain</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Configure a custom domain for your website. Add your domain and
            follow the DNS configuration instructions.
          </p>

          {userPlan === "free" ? (
            <div className="text-center p-6 border rounded-lg bg-muted/50">
              <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Custom domains are available for premium users only. Upgrade
                your plan to use this feature.
              </p>
              <Button onClick={() => setShowSettings(true)} variant="default">
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
                />
                <Button onClick={addDomain} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Add Domain
                </Button>
              </div>

              {currentDomain && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Current Domain</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-mono">{currentDomain.domain}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={checkVerification}
                        disabled={loading}
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
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">DNS Configuration Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Add these DNS records to your domain's DNS configuration. It
                    may take up to 48 hours for DNS changes to propagate.
                  </p>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-[100px]">Copy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>A</TableCell>
                        <TableCell>@</TableCell>
                        <TableCell className="font-mono text-sm">
                          76.76.21.21
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard("76.76.21.21", "a")}
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
              )}
            </>
          )}
        </div>
      </Card>

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
