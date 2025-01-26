"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for trying out our RapidSite AI Website Builder",
    features: [
      "1 website",
      "Basic AI editing",
      "Community support",
      "Free subdomain",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 29, yearly: 290 },
    description: "For professionals and growing businesses",
    features: [
      "Unlimited websites",
      "Advanced AI editing",
      "Priority support",
      "Custom domain",
      "Remove RapidSite AI Website Builder branding",
      "Advanced analytics",
      "Team collaboration",
      "Custom CSS injection",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    description: "For large organizations with custom needs",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Custom AI training",
      "API access",
      "SSO & advanced security",
      "SLA guarantee",
      "Custom integrations",
      "Onboarding assistance",
    ],
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Perfect Plan
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start free, upgrade when you need to
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-purple-500" : "text-gray-500"
              )}
            >
              Monthly
            </span>
            <motion.button
              className={cn(
                "w-16 h-8 rounded-full p-1 transition-colors",
                isYearly ? "bg-purple-500" : "bg-gray-300"
              )}
              onClick={() => setIsYearly(!isYearly)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full"
                animate={{ x: isYearly ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-purple-500" : "text-gray-500"
              )}
            >
              Yearly{" "}
              <span className="text-green-500 font-bold">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Most Popular
                </motion.div>
              )}

              <motion.div
                className={cn(
                  "bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg relative overflow-hidden",
                  plan.popular &&
                    "border-2 border-purple-500 dark:border-purple-400"
                )}
                animate={{
                  scale: hoveredPlan === index ? 1.05 : 1,
                  y: hoveredPlan === index ? -10 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Background Gradient */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300",
                    hoveredPlan === index && "opacity-5",
                    "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
                  )}
                />

                <div className="relative">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {typeof plan.price[isYearly ? "yearly" : "monthly"] ===
                      "number"
                        ? `$${plan.price[isYearly ? "yearly" : "monthly"]}`
                        : plan.price[isYearly ? "yearly" : "monthly"]}
                    </span>
                    {typeof plan.price[isYearly ? "yearly" : "monthly"] ===
                      "number" && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        /{isYearly ? "year" : "month"}
                      </span>
                    )}
                  </div>

                  <Button
                    className={cn(
                      "w-full mb-6",
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Get Started"}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Special Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Limited Time Offer! 🎉</h3>
          <p className="mb-4">
            Get 50% off on yearly plans for our launch week. Don't miss out!
          </p>
          <Button className="bg-white text-purple-500 hover:bg-gray-100">
            Claim Your Discount
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
