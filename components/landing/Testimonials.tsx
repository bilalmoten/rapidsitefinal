"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
const testimonials = [
  {
    name: "Olivia Parker",
    role: "Small Business Owner",
    company: "Parker Consulting",
    image: "/avatars/avatar-09.jpg",
    content:
      "Created a professional-looking business website in minutes. The AI made it so simple to explain what I needed.",
    rating: 5,
  },
  {
    name: "Marcus Zhang",
    role: "Photographer",
    company: "Zhang Visuals",
    image: "/avatars/avatar-01.jpg",
    content:
      "Perfect for my portfolio website. Clean, simple, and shows my work beautifully.",
    rating: 5,
  },
  {
    name: "Isabella Romano",
    role: "Marketing Consultant",
    company: "Clear Strategy",
    image: "/avatars/avatar-10.jpg",
    content:
      "Built a great landing page for my consulting services. Love how easy it is to update content.",
    rating: 5,
  },
  {
    name: "Ryan O'Connor",
    role: "Freelance Writer",
    company: "Content Solutions",
    image: "/avatars/avatar-02.jpg",
    content:
      "Finally have a professional website to showcase my writing portfolio and services.",
    rating: 5,
  },
  {
    name: "Sophia Patel",
    role: "Life Coach",
    company: "Mindful Growth",
    image: "/avatars/avatar-11.jpg",
    content:
      "The AI helped me create a welcoming, professional site that perfectly represents my coaching practice.",
    rating: 5,
  },
  {
    name: "Daniel Kim",
    role: "Personal Trainer",
    company: "Kim Fitness",
    image: "/avatars/avatar-03.jpg",
    content:
      "Great for my fitness business landing page. Simple, modern, and gets my message across.",
    rating: 5,
  },
  {
    name: "Zara Thompson",
    role: "Yoga Instructor",
    company: "Zen Space Yoga",
    image: "/avatars/avatar-13.jpg",
    content:
      "Created a beautiful, minimalist website for my yoga classes in just an afternoon.",
    rating: 5,
  },
  {
    name: "Adrian Chen",
    role: "IT Consultant",
    company: "Tech Help Pro",
    image: "/avatars/avatar-04.jpg",
    content:
      "Perfect for my IT consultancy website. Clean, professional, and easy to maintain.",
    rating: 5,
  },
];

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) => (
  <motion.div
    className="w-[350px] p-6 mx-4 bg-white/5 backdrop-blur-sm rounded-xl border border-cyan-500/20"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-start gap-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/20">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <h4 className="font-semibold text-gray-200">{testimonial.name}</h4>
        <p className="text-sm text-gray-400">{testimonial.role}</p>
        <p className="text-xs text-cyan-500">{testimonial.company}</p>
      </div>
      <div className="ml-auto flex">
        {Array(testimonial.rating)
          .fill(null)
          .map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ))}
      </div>
    </div>
    <p className="mt-4 text-gray-300">{testimonial.content}</p>
  </motion.div>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-10 bg-[#0F1729] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-700">
              Creators
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their ideas
            into reality
          </p>
        </motion.div>

        <div className="relative">
          {/* First row - moving right */}
          <Marquee className="mb-8" pauseOnHover>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </Marquee>

          {/* Second row - moving left */}
          <Marquee reverse pauseOnHover>
            {testimonials.reverse().map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </Marquee>

          {/* Fixed the fade effect by matching the background color */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0F1729] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#0F1729] to-transparent" />
        </div>
      </div>
    </section>
  );
}
