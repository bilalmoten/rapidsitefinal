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
  const [isLoading, setIsLoading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    // Add your navigation logic here
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user}>
      <main className="pt-16">
        <HeroSection onGetStarted={handleGetStarted} isLoading={isLoading} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
