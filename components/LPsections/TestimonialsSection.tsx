import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TestimonialsSection() {
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
    <section className="container mx-auto px-4 py-20  m-6">
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
