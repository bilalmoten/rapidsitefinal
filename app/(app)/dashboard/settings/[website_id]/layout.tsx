import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Settings,
  FormInput,
  Mail,
  ShoppingBag,
  FileText,
  BadgeAlert,
} from "lucide-react";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ website_id: string }>;
}) {
  const resolvedParams = await params;
  const tabs = [
    { id: "", label: "Settings", icon: Settings },
    { id: "forms", label: "Forms", icon: FormInput },
    { id: "newsletter", label: "Newsletter", icon: Mail, comingSoon: true },
    { id: "products", label: "Products", icon: ShoppingBag, comingSoon: true },
    { id: "blog", label: "Blog", icon: FileText, comingSoon: true },
  ];

  return (
    <div className="min-h-screen relative">
      <DashboardBackground />
      <div className="relative z-10">
        <div className="container mx-auto py-6 px-4 space-y-6">
          <div className="border border-neutral-70 rounded-lg bg-[#0a0a0b00] backdrop-blur-sm">
            <Tabs defaultValue="" className="w-full">
              <TabsList className="w-full justify-start gap-2 bg-transparent p-2">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    asChild
                    disabled={tab.comingSoon}
                  >
                    <Link
                      href={`/dashboard/settings/${resolvedParams.website_id}${tab.id ? `/${tab.id}` : ""}`}
                      className="flex items-center gap-2 relative data-[state=active]:bg-primary-main data-[state=active]:text-primary-foreground text-neutral-20"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.comingSoon && (
                        <div className="absolute -top-2 -right-2">
                          <span className="text-xs px-2 py-1 bg-primary-main bg-opacity-10 text-primary-main rounded">
                            Soon
                          </span>
                        </div>
                      )}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
