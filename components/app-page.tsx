"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Code,
  Layout,
  Cpu,
  Upload,
  MessageSquare,
  PenTool,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";

export function Page() {
  const [darkMode, setDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode ? "dark bg-gray-950 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 to-indigo-950"
              : "bg-gradient-to-br from-indigo-50 to-purple-50"
          }`}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={
                  darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
                }
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* <MovingBlob darkMode={darkMode} /> */}
      </div>
      <div className="relative z-10">
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? (darkMode ? "bg-gray-900/80" : "bg-white/80") +
                " backdrop-blur-md shadow-md"
              : ""
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.h1
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI Website Builder
            </motion.h1>
            <nav className="flex items-center space-x-6">
              <Link
                href="#features"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="hover:text-indigo-500 transition-colors text-sm font-medium"
              >
                Blog
              </Link>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </nav>
          </div>
        </header>

        <main className="pt-16">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <PricingSection />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

// function MovingBlob({ darkMode }) {
//   return (
//     <motion.div
//       className={`absolute top-0 left-0 w-[800px] h-[800px] rounded-full ${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900 opacity-20' : 'bg-gradient-to-r from-indigo-300 to-purple-300 opacity-30'} blur-3xl`}
//       animate={{
//         x: [0, 100, 0],
//         y: [0, 50, 0],
//         scale: [1, 1.1, 1],
//       }}
//       transition={{
//         duration: 20,
//         repeat: Infinity,
//         repeatType: "reverse",
//       }}
//     />
//   )
// }

function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Build Your Dream Website with AI
        </motion.h2>
        <motion.p
          className="text-xl mb-8 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create stunning, personalized websites in minutes with our AI-powered
          platform. No coding required.
        </motion.p>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 px-8 py-3 rounded-full"
          >
            Watch Demo
          </Button>
        </motion.div>
      </div>
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="AI Website Builder"
          width={600}
          height={400}
          className="rounded-lg shadow-2xl"
        />
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "AI-Powered Chat",
      description: "Describe your website and let our AI do the rest",
    },
    {
      icon: <Layout className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "Stunning Designs",
      description: "Choose from a variety of beautiful, customizable templates",
    },
    {
      icon: <PenTool className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "Easy Customization",
      description: "Edit any part of your website with simple instructions",
    },
    {
      icon: <Code className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "Code Export",
      description: "Download your website's code for further customization",
    },
    {
      icon: <Upload className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "One-Click Publish",
      description: "Publish your website to a free subdomain instantly",
    },
    {
      icon: <Cpu className="h-8 w-8 mb-4 text-indigo-500" />,
      title: "AI-Driven Optimization",
      description: "Automatically optimize your site for performance and SEO",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Powerful Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
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
      icon: <MessageSquare className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "AI Generates Design",
      description:
        "Our AI creates a stunning design based on your requirements",
      icon: <Layout className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "Customize and Refine",
      description:
        "Easily modify any part of your website with simple instructions",
      icon: <PenTool className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: "Publish and Share",
      description:
        "Publish your website to a free subdomain or export the code",
      icon: <Upload className="w-8 h-8 text-indigo-500" />,
    },
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        How It Works
      </h2>
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-800"></div>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`flex items-center mb-12 last:mb-0 ${
              index % 2 === 0 ? "flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div
              className={`w-1/2 ${index % 2 === 0 ? "pl-8" : "pr-8"} flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-indigo-100 dark:bg-indigo-900 rounded-full p-2">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-900 z-10 flex items-center justify-center text-white font-bold">
              {index + 1}
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
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Jane Smith",
      role: "Freelance Designer",
      quote:
        "As a designer, I was skeptical at first, but the AI-generated designs are impressive. It's a great starting point for my projects.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Mike Johnson",
      role: "Small Business Owner",
      quote:
        "I'm not tech-savvy, but this platform made it easy for me to create and maintain my own website. It's a game-changer!",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center mb-4">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
            <p className="italic text-gray-600 dark:text-gray-300">
              "{testimonial.quote}"
            </p>
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
        "24/7 Support",
        "1 Website",
        "100k Visitors/month",
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
        "SEO Tools",
        "5 Websites",
        "500k Visitors/month",
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
        "White-label Solution",
        "Unlimited Websites",
        "Unlimited Visitors",
      ],
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Choose Your Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className="flex flex-col h-full p-8 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <p className="text-4xl font-bold mb-6 text-indigo-600">
              {plan.price}
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <ChevronRight className="h-5 w-5 mr-2 text-indigo-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full mt-auto">
              Choose Plan
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
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

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              AI Website Builder
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Creating stunning websites with the power of AI
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-600">
              Product
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-600">
              Company
            </h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-600">
              Stay Updated
            </h4>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Subscribe to our newsletter for the latest updates
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-l-full"
              />
              <Button
                type="submit"
                className="rounded-r-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} AI Website Builder. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
