"use client";

import { useState } from "react";

export default function NewsletterSignupTest() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-neutral-90/50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-neutral-10">
        Newsletter Test
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded border border-neutral-70 bg-neutral-90/50 text-neutral-10 placeholder-neutral-30"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary-main text-neutral-90 py-2 px-4 rounded hover:bg-primary-main/90 disabled:opacity-50"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe to Newsletter"}
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-3 rounded ${status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
