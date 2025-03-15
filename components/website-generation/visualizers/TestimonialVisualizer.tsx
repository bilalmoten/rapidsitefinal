"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface TestimonialVisualizerProps {
  testimonials: Array<{
    name: string;
    role: string;
    quote: string;
  }>;
  progress: number;
}

export default function TestimonialVisualizer({
  testimonials,
  progress,
}: TestimonialVisualizerProps) {
  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      quote:
        "This product has transformed how our team works. The efficiency gains have been remarkable.",
    },
    {
      name: "Michael Chen",
      role: "CTO, InnovateCorp",
      quote:
        "The integration capabilities are impressive. I was able to connect all our systems in hours, not weeks.",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director, GrowthLeaders",
      quote:
        "Our marketing workflow is now streamlined and more effective. Highly recommended for any marketing team.",
    },
  ];

  // Use provided testimonials or default
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  // Calculate how many testimonials to show based on progress
  const visibleTestimonials = Math.ceil(
    (progress / 100) * displayTestimonials.length
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Generate a random pastel color for avatar backgrounds
  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500/20 text-blue-400",
      "bg-purple-500/20 text-purple-400",
      "bg-green-500/20 text-green-400",
      "bg-pink-500/20 text-pink-400",
      "bg-yellow-500/20 text-yellow-400",
      "bg-indigo-500/20 text-indigo-400",
    ];

    return colors[index % colors.length];
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Quote className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Adding customer testimonials
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Showcasing real feedback from satisfied customers to build trust and
          credibility
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {displayTestimonials.map((testimonial, index) => {
          const isVisible = index < visibleTestimonials;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={isVisible ? undefined : "hidden"}
              animate={isVisible ? "visible" : "hidden"}
              className={`p-6 rounded-lg border ${
                isVisible
                  ? "border-blue-500/30 bg-blue-500/5"
                  : "border-gray-700 bg-gray-800/30"
              }`}
            >
              {isVisible && (
                <motion.div
                  className="flex items-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getAvatarColor(index)}`}
                  >
                    {getInitials(testimonial.name)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </motion.div>
              )}

              <blockquote
                className={`${isVisible ? "text-gray-300" : "text-gray-600"}`}
              >
                {isVisible ? (
                  <>
                    <Quote className="w-4 h-4 text-blue-400 inline-block -translate-y-1 mr-1" />
                    {testimonial.quote}
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                  </div>
                )}
              </blockquote>

              {isVisible && (
                <motion.div
                  className="mt-4 flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </motion.div>
              )}

              {isVisible && (
                <motion.div
                  className="w-full h-1 mt-4 bg-blue-500/30 relative overflow-hidden rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="text-center mt-8 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          Testimonials Added: {visibleTestimonials} of{" "}
          {displayTestimonials.length}
        </p>
      </motion.div>
    </div>
  );
}
