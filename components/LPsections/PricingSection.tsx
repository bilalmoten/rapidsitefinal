import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
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
    <section id="pricing" className="container mx-auto px-4 py-20  m-6">
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
      <div className="h-12"></div>
    </section>
  );
}
