import React from "react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready to Build Your Dream Website?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white opacity-90">
          Join thousands of satisfied users and create your stunning website
          today with our AI-powered platform.
        </p>
        <Button
          size="lg"
          className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold"
        >
          Get Started for Free
        </Button>
      </div>
    </section>
  );
}
