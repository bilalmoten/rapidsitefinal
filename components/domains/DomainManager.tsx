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
import { Copy, Check, RefreshCw } from "lucide-react";

interface DomainManagerProps {
  websiteId: string;
}

export function DomainManager({ websiteId }: DomainManagerProps) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<any>(null);
  const [verificationDetails, setVerificationDetails] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

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
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Custom Domain</h2>

      {!currentDomain ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Domain Name
            </label>
            <div className="flex gap-2">
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                disabled={loading}
              />
              <Button onClick={addDomain} disabled={loading}>
                Add Domain
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentDomain.domain}</p>
              <p className="text-sm text-muted-foreground capitalize">
                Status: {currentDomain.status}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={checkVerification}
                disabled={loading || currentDomain.status === "active"}
              >
                Check Verification
              </Button>
              <Button
                variant="destructive"
                onClick={removeDomain}
                disabled={loading}
              >
                Remove
              </Button>
            </div>
          </div>

          {currentDomain.status === "pending" && (
            <div className="space-y-4">
              <h3 className="font-medium">DNS Configuration Required</h3>
              <p className="text-sm text-muted-foreground">
                Add the following DNS records to configure your domain. This may
                take up to 48 hours to propagate.
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

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4" />
                Click "Verify" after adding both DNS records
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
