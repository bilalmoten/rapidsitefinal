import { SidebarProvider } from "@/contexts/SidebarContext";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
