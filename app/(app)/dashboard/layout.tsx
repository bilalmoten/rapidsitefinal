"use client";

import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import DashboardSidebar from "@/components/DashboardSidebar";

// Create a wrapper component to use the sidebar context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          isExpanded ? "ml-[256px]" : "ml-[80px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

// Main layout component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
