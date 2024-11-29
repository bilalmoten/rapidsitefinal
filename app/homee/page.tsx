"use client";

import Layout from "@/components/landing/Layout";
import Hero from "@/components/landing/Hero";
import ValueProposition from "@/components/landing/ValueProposition";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Showcase from "@/components/landing/Showcase";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
// import ThemePreview from "@/components/landing/ThemePreview";
import EditorShowcase from "@/components/landing/EditorShowcase/index";
import Testimonials from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <Layout>
      <Hero />
      {/* <ThemePreview /> */}
      <HowItWorks />
      <EditorShowcase />
      <Showcase />
      <Testimonials />
      <FAQ />
      <Features />
      <Pricing />
      <ValueProposition />
      <CTA />
    </Layout>
  );
}
