"use client";

import { useState } from "react";
import {
  Search,
  Zap,
  Building2,
  Sparkles,
  Rocket,
  Users,
  Check,
  Image,
  Globe,
  HardDrive,
  Wifi,
  Shield,
  FileCode,
  BarChart,
  MessageSquare,
  FileText,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "Forever free",
      description:
        "Perfect for trying out Rapid Site AI website builder in minutes",
      features: [
        { icon: Building2, text: "1 website" },
        { icon: Sparkles, text: "3 AI website generations/month" },
        { icon: Zap, text: "10 AI edits/month" },
        { icon: Image, text: "5 image generations/month" },
        { icon: FileText, text: "Up to 5 pages per site" },
        { icon: Globe, text: "Free subdomain publishing" },
        { icon: HardDrive, text: "1GB storage" },
        { icon: Wifi, text: "10GB bandwidth" },
        { icon: Shield, text: "SSL included" },
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      price: isYearly ? "15" : "19",
      period: "billed monthly",
      saveText: "Save $38 annually",
      description: "For serious creators ready to build amazing websites",
      features: [
        { icon: Building2, text: "5 websites" },
        { icon: Sparkles, text: "20 AI website generations/month" },
        { icon: Zap, text: "Unlimited AI edits" },
        { icon: Image, text: "50 image generations/month" },
        { icon: FileText, text: "Up to 20 pages per site" },
        { icon: Globe, text: "Custom domain (coming soon)" },
        { icon: HardDrive, text: "10GB storage" },
        { icon: Wifi, text: "100GB bandwidth" },
        { icon: Shield, text: "Premium SSL included" },
        { icon: BarChart, text: "Analytics (coming soon)" },
        {
          icon: MessageSquare,
          text: "100 form responses/month (coming soon)",
        },
        { icon: FileCode, text: "Code export" },
        { icon: Users, text: "Live support" },
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: isYearly ? "39" : "49",
      period: "billed monthly",
      description:
        "Custom solutions for growing businesses" + " and enterprises",
      features: [
        { icon: Building2, text: "Unlimited websites" },
        { icon: Sparkles, text: "Unlimited AI generations" },
        { icon: Zap, text: "Unlimited AI edits" },
        { icon: Image, text: "Unlimited image generations" },
        { icon: FileText, text: "Unlimited pages" },
        { icon: Globe, text: "Priority custom domain support" },
        { icon: HardDrive, text: "100GB storage" },
        { icon: Wifi, text: "Unlimited bandwidth" },
        { icon: Shield, text: "Premium SSL" },
        { icon: BarChart, text: "Advanced analytics (coming soon)" },
        {
          icon: MessageSquare,
          text: "Unlimited form responses (coming soon)",
        },
        { icon: FileCode, text: "Code export" },
        { icon: Users, text: "Live support" },
        { icon: Crown, text: "Priority access to new features" },
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,41,0.3)_0%,rgba(15,23,41,0)_60%)] backdrop-blur-[1px]" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 mb-8">
            Choose the perfect plan for your needs
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm", !isYearly && "text-cyan-400")}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-700"
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  isYearly ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span className={cn("text-sm", isYearly && "text-cyan-400")}>
              Yearly <span className="text-green-400">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl bg-white/5 p-8 relative",
                plan.popular
                  ? "border-2 border-cyan-400"
                  : "border border-gray-800"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-sm rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <div className="text-sm text-gray-400">{plan.period}</div>
              {plan.saveText && isYearly && (
                <div className="text-purple-400 text-sm mt-1">
                  {plan.saveText}
                </div>
              )}

              <p className="text-gray-400 mt-6 mb-8">{plan.description}</p>

              <ul className="space-y-4 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <feature.icon className="h-5 w-5 text-cyan-400" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
