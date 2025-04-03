"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// We'll handle the case where MainNav and UserNav might not exist
// let MainNav: React.ComponentType<{ className?: string }> | null = null;
// let UserNav: React.ComponentType | null = null;

// // Try to dynamically import them if they exist
// try {
//   MainNav = require("@/components/MainNav").MainNav;
// } catch (error) {
//   console.log("MainNav not available");
// }

// try {
//   UserNav = require("@/components/UserNav").UserNav;
// } catch (error) {
//   console.log("UserNav not available");
// }

export default function ProChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background/90 to-background">
      {/* <header className="sticky top-0 z-50 border-b bg-background/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <div className="mr-6 flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-border mx-1"></div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <h1 className="text-base font-semibold">Pro Website Designer</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex text-muted-foreground text-sm items-center gap-1 bg-muted px-3 py-1.5 rounded-full"
            >
              <span
                className={cn("h-2 w-2 rounded-full", "bg-green-500")}
              ></span>
              Models Ready
            </motion.div>
            {UserNav ? (
              <UserNav />
            ) : (
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            )} 
          </div>
        </div>
      </header> */}

      <div className="flex-1 overflow-hidden">{children}</div>

      {/* <footer className="border-t py-3 bg-background/40 backdrop-blur-sm">
        <div className="container flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RapidSite Pro Designer
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Help & Documentation
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
