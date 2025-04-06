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
import { logger } from "@/utils/logger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import posthog from "posthog-js";

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

  // New state variables for logger testing
  const [logLevel, setLogLevel] = useState<"debug" | "info" | "warn" | "error">(
    "info"
  );
  const [logMessage, setLogMessage] = useState<string>("Test log message");
  const [logFeature, setLogFeature] = useState<string>("logger-test");
  const [logComponent, setLogComponent] = useState<string>("claude-test-page");
  const [includeError, setIncludeError] = useState<boolean>(false);
  const [logResponse, setLogResponse] = useState<string>("");
  const [isLoggingClient, setIsLoggingClient] = useState<boolean>(false);
  const [isLoggingServer, setIsLoggingServer] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

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
          setUserId(user.id);
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

  // Test Gemini model through the API route
  const testgeminimodel = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt to test the gemini model.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResponse("");

    try {
      const response = await fetch("/api/test/gemini", {
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
        description: "gemini flash response received!",
      });
    } catch (error) {
      console.error("gemini test error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to test gemini model",
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

  // Add new function to test client-side logger
  const testClientLogger = () => {
    setIsLoggingClient(true);
    setLogResponse("");

    try {
      // Create test error if needed
      const testError = includeError
        ? new Error("This is a test error for client-side logging")
        : undefined;

      // Log using our logger utility
      if (logLevel === "debug") {
        logger.debug(logMessage, {
          feature: logFeature,
          component: logComponent,
        });
      } else if (logLevel === "info") {
        logger.info(logMessage, {
          feature: logFeature,
          component: logComponent,
          sendToAnalytics: true,
        });
      } else if (logLevel === "warn") {
        logger.warn(logMessage, {
          feature: logFeature,
          component: logComponent,
        });
      } else if (logLevel === "error") {
        logger.error(logMessage, testError, {
          feature: logFeature,
          component: logComponent,
        });
      }

      // If we're tracking an event
      logger.track("logger_test_event", {
        level: logLevel,
        feature: logFeature,
        component: logComponent,
        includeError,
        timestamp: new Date().toISOString(),
      });

      posthog.capture("test-event", { test: "test-event-property" });

      setLogResponse(
        `Client-side log sent successfully!\n\nLevel: ${logLevel}\nMessage: ${logMessage}\nFeature: ${logFeature}\nComponent: ${logComponent}`
      );

      toast({
        title: "Success",
        description: "Client-side log sent successfully!",
      });
    } catch (error) {
      console.error("Client logger test error:", error);
      setLogResponse(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      toast({
        title: "Error",
        description: "Failed to test client-side logger",
        variant: "destructive",
      });
    } finally {
      setIsLoggingClient(false);
    }
  };

  // Add function to test server-side logger
  const testServerLogger = async () => {
    setIsLoggingServer(true);
    setLogResponse("");

    posthog.capture("test-event", { test: "test-event-property" });

    try {
      const response = await fetch("/api/test/logger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: logLevel,
          message: logMessage,
          feature: logFeature,
          component: logComponent,
          includeError,
          userId: userId,
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
      setLogResponse(JSON.stringify(data, null, 2));

      toast({
        title: "Success",
        description: "Server-side log sent successfully!",
      });
    } catch (error) {
      console.error("Server logger test error:", error);

      setLogResponse(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );

      toast({
        title: "Error",
        description: "Failed to test server-side logger",
        variant: "destructive",
      });
    } finally {
      setIsLoggingServer(false);
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
        Private testing page for Claude 3.7 Sonnet, email, and logger
        functionality.
      </p>

      <Tabs defaultValue="claude">
        <TabsList className="mb-6">
          <TabsTrigger value="claude">Claude 3.7 Test</TabsTrigger>
          <TabsTrigger value="email">Email Test</TabsTrigger>
          <TabsTrigger value="logger">Logger Test</TabsTrigger>
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
            <CardFooter>
              <Button
                onClick={testgeminimodel}
                disabled={isGenerating || !prompt}
                className="ml-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Test Gemini Model"
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

        <TabsContent value="logger">
          <Card>
            <CardHeader>
              <CardTitle>Test Logger System</CardTitle>
              <CardDescription>
                Test the client-side and server-side logging functionality that
                integrates with PostHog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                      defaultValue={logLevel}
                      onValueChange={(val) => setLogLevel(val as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="includeError">Include Error Object</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="includeError"
                        checked={includeError}
                        onChange={(e) => setIncludeError(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="includeError">
                        {includeError ? "Yes" : "No"}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logMessage">Log Message</Label>
                    <Input
                      id="logMessage"
                      value={logMessage}
                      onChange={(e) => setLogMessage(e.target.value)}
                      placeholder="Enter log message"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logFeature">Feature</Label>
                    <Input
                      id="logFeature"
                      value={logFeature}
                      onChange={(e) => setLogFeature(e.target.value)}
                      placeholder="Enter feature name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logComponent">Component</Label>
                    <Input
                      id="logComponent"
                      value={logComponent}
                      onChange={(e) => setLogComponent(e.target.value)}
                      placeholder="Enter component name"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <Button
                    onClick={testClientLogger}
                    disabled={isLoggingClient}
                    className="flex-1"
                  >
                    {isLoggingClient ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Testing Client Logger...
                      </>
                    ) : (
                      "Test Client-Side Logger"
                    )}
                  </Button>

                  <Button
                    onClick={testServerLogger}
                    disabled={isLoggingServer}
                    className="flex-1"
                  >
                    {isLoggingServer ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Testing Server Logger...
                      </>
                    ) : (
                      "Test Server-Side Logger"
                    )}
                  </Button>
                </div>

                {logResponse && (
                  <div className="space-y-2">
                    <Label>Response</Label>
                    <div className="p-4 bg-muted rounded-md overflow-auto max-h-96">
                      <pre className="whitespace-pre-wrap">{logResponse}</pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
