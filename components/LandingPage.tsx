"use client";

import React, { useState } from "react";
import Layout from "./Layout";
import HeroSection from "./LPsections/HeroSection";
import FeaturesSection from "./LPsections/FeaturesSection";
import HowItWorksSection from "./LPsections/HowItWorksSection";
import TestimonialsSection from "./LPsections/TestimonialsSection";
import PricingSection from "./LPsections/PricingSection";
import CtaSection from "./LPsections/CtaSection";
import { User } from "@supabase/supabase-js";
interface LandingPageProps {
  user: User | null;
}

export default function LandingPage({ user }: LandingPageProps) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
