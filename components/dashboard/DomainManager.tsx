import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DomainManager({ website_id }: { website_id: string }) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const addDomain = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const response = await fetch("/api/domains/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain, website_id }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setVerificationDetails(data);
      toast.success(
        "Domain added successfully! Please configure your DNS records."
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to add domain");
    } finally {
      setLoading(false);
    }
  };

  const verifyDomain = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const response = await fetch("/api/domains/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      if (data.misconfigured) {
        toast.error(
          "Domain verification failed. Please check your DNS configuration."
        );
        return;
      }

      toast.success("Domain verified successfully!");
      // Optionally refresh the page or update UI state
    } catch (error) {
      toast.error("Failed to verify domain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domain</CardTitle>
        <CardDescription>
          Configure a custom domain for your website. Add your domain and follow
          the DNS configuration instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Enter your domain (e.g., example.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
          />
          <Button onClick={addDomain} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Add Domain
          </Button>
        </div>

        {verificationDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">DNS Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add these DNS records to your domain's DNS configuration. It may
              take up to 48 hours for DNS changes to propagate.
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
                <TableRow>
                  <TableCell>TXT</TableCell>
                  <TableCell>@</TableCell>
                  <TableCell className="font-mono text-sm">
                    {verificationDetails?.verification?.[0]?.value ||
                      "No verification value found"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          verificationDetails?.verification?.[0]?.value || "",
                          "txt"
                        )
                      }
                    >
                      {copied === "txt" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-6">
              <Button onClick={verifyDomain} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Verify Domain
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
