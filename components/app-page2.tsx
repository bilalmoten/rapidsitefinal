"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  MessageSquare,
  Layout,
  PenTool,
  Code,
  Upload,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PageProps {
  user: User | null;
}

export function Page({ user }: PageProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAuthAction = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white relative overflow-hidden">
      <Image
        src="/SL-072622-51930-20.svg"
        alt="Background Grid"
        layout="fill"
        objectFit="cover"
        className="opacity-10"
      />
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center backdrop-blur-md bg-white bg-opacity-10 rounded-b-lg">
          <motion.h1
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Website Builder
          </motion.h1>
          <nav className="flex items-center space-x-6">
            <Link
              href="#features"
              className="hover:text-purple-200 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-purple-200 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-purple-200 transition-colors"
            >
              Pricing
            </Link>
            <Button
              size="sm"
              className="bg-white text-purple-500 hover:bg-purple-100"
              onClick={handleAuthAction}
            >
              {user ? "Dashboard" : "Sign In"}
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </div>
          </nav>
        </header>

        <main className="space-y-24 container mx-auto px-4 py-12">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <PricingSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <section className="text-center">
      <motion.h2
        className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Build Your Dream Website with AI
      </motion.h2>
      <motion.p
        className="text-xl md:text-2xl mb-8 text-purple-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Create stunning, personalized websites in minutes with our AI-powered
        platform
      </motion.p>
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          size="lg"
          className="bg-white text-purple-500 hover:bg-purple-100"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-purple-500"
        >
          Learn More
        </Button>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 mb-4 text-purple-200" />,
      title: "AI-Powered Chat",
      description: "Describe your website and let our AI do the rest",
    },
    {
      icon: <Layout className="h-8 w-8 mb-4 text-purple-200" />,
      title: "Stunning Designs",
      description: "Choose from a variety of beautiful, customizable templates",
    },
    {
      icon: <PenTool className="h-8 w-8 mb-4 text-purple-200" />,
      title: "Easy Customization",
      description: "Edit any part of your website with simple instructions",
    },
    {
      icon: <Code className="h-8 w-8 mb-4 text-purple-200" />,
      title: "Code Export",
      description: "Download your website's code for further customization",
    },
    {
      icon: <Upload className="h-8 w-8 mb-4 text-purple-200" />,
      title: "One-Click Publish",
      description: "Publish your website to a free subdomain instantly",
    },
    {
      icon: <Cpu className="h-8 w-8 mb-4 text-purple-200" />,
      title: "AI-Driven Optimization",
      description: "Automatically optimize your site for performance and SEO",
    },
  ];

  return (
    <section id="features" className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
        Powerful Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-lg shadow-lg backdrop-blur-md bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-purple-100">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Describe Your Vision",
      description:
        "Chat with our AI and describe the website you want to create",
    },
    {
      title: "AI Generates Design",
      description:
        "Our AI creates a stunning design based on your requirements",
    },
    {
      title: "Customize and Refine",
      description:
        "Easily modify any part of your website with simple instructions",
    },
    {
      title: "Publish and Share",
      description:
        "Publish your website to a free subdomain or export the code",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-900 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
        How It Works
      </h2>
      <div className="space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 text-purple-500 flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-purple-100">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "John Doe",
      role: "Entrepreneur",
      quote:
        "This AI website builder saved me so much time and money. I was able to create a professional-looking website for my business in just a few hours!",
    },
    {
      name: "Jane Smith",
      role: "Freelance Designer",
      quote:
        "As a designer, I was skeptical at first, but the AI-generated designs are impressive. It's a great starting point for my projects.",
    },
    {
      name: "Mike Johnson",
      role: "Small Business Owner",
      quote:
        "I'm not tech-savvy, but this platform made it easy for me to create and maintain my own website. It's a game-changer!",
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-lg shadow-lg backdrop-blur-md bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <p className="mb-4 italic text-purple-100">"{testimonial.quote}"</p>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-purple-100">{testimonial.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Basic",
      price: "$9.99/mo",
      features: [
        "AI Website Generation",
        "Free Subdomain",
        "Basic Customization",
      ],
    },
    {
      name: "Pro",
      price: "$19.99/mo",
      features: [
        "Everything in Basic",
        "Custom Domain",
        "Advanced AI Editing",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Dedicated Account Manager",
        "Custom AI Training",
        "SLA",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-900 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
        Choose Your Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-lg shadow-lg backdrop-blur-md bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6 text-purple-200">
              {plan.price}
            </p>
            <ul className="space-y-2 mb-6 text-purple-100">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
            <Button className="w-full bg-purple-200 text-purple-500 hover:bg-purple-300">
              Choose Plan
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">
              AI Website Builder
            </h3>
            <p className="text-purple-100">
              Creating stunning websites with the power of AI
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-200">
              Product
            </h4>
            <ul className="space-y-2 text-purple-100">
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-200">
              Company
            </h4>
            <ul className="space-y-2 text-purple-100">
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-200 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-200">
              Stay Updated
            </h4>
            <p className="mb-4 text-purple-100">
              Subscribe to our newsletter for the latest updates
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-r-none"
              />
              <Button
                type="submit"
                className="rounded-l-none bg-purple-200 text-purple-500 hover:bg-purple-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-purple-100">
          <p>
            &copy; {new Date().getFullYear()} AI Website Builder. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
