"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function ClaudeTestPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prompt, setPrompt] = useState<string>(
    "Tell me about Claude 3.7 Sonnet and its capabilities."
  );
  const [response, setResponse] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [testWebsiteName, setTestWebsiteName] =
    useState<string>("Test Website");
  const [testWebsiteId, setTestWebsiteId] = useState<string>("test-123");
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (user && user.email === "bilalmoten2@gmail.com") {
          setUserEmail(user.email);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Test Claude 3.7 Sonnet through the server-side API
  const testClaudeModel = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to test the Claude model.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResponse("");

    try {
      const response = await fetch("/api/test/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setResponse(data.response);

      toast({
        title: "Success",
        description: "Claude 3.7 Sonnet response received!",
      });
    } catch (error) {
      console.error("Claude test error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to test Claude model",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Test email functionality through the server-side API
  const testEmailSending = async () => {
    if (!testWebsiteName || !testWebsiteId) {
      toast({
        title: "Error",
        description: "Please enter a test website name and ID.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch("/api/test/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteName: testWebsiteName,
          websiteId: testWebsiteId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: data.message || `Test email sent to ${userEmail}`,
      });
    } catch (error) {
      console.error("Email test error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle unauthorized access or loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Private Testing Page</h1>
        <p className="text-xl text-center max-w-md mb-6">
          This page is only accessible to the website developer.
        </p>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Return to Homepage
        </Button>
      </div>
    );
  }

  // Main content for authorized user
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">RapidSite Testing Tools</h1>
      <p className="text-muted-foreground mb-6">
        Private testing page for Claude 3.7 Sonnet and email functionality.
      </p>

      <Tabs defaultValue="claude">
        <TabsList className="mb-6">
          <TabsTrigger value="claude">Claude 3.7 Test</TabsTrigger>
          <TabsTrigger value="email">Email Test</TabsTrigger>
        </TabsList>

        <TabsContent value="claude">
          <Card>
            <CardHeader>
              <CardTitle>Test Claude 3.7 Sonnet</CardTitle>
              <CardDescription>
                Send a test prompt to the Claude 3.7 Sonnet model via AWS
                Bedrock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="h-32"
                  />
                </div>

                {response && (
                  <div className="space-y-2">
                    <Label>Response</Label>
                    <div className="p-4 bg-muted rounded-md overflow-auto max-h-96">
                      <pre className="whitespace-pre-wrap">{response}</pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={testClaudeModel}
                disabled={isGenerating || !prompt}
                className="ml-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Test Claude Model"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Notification</CardTitle>
              <CardDescription>
                Send a test website completion email to yourself.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Your Email</Label>
                  <Input
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="websiteName">Test Website Name</Label>
                  <Input
                    id="websiteName"
                    value={testWebsiteName}
                    onChange={(e) => setTestWebsiteName(e.target.value)}
                    placeholder="Enter a test website name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteId">Test Website ID</Label>
                  <Input
                    id="websiteId"
                    value={testWebsiteId}
                    onChange={(e) => setTestWebsiteId(e.target.value)}
                    placeholder="Enter a test website ID"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={testEmailSending}
                disabled={isSendingEmail || !testWebsiteName || !testWebsiteId}
                className="ml-auto"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  "Send Test Email"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
