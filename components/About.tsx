"use client";

import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import WordStrip from "./ui/WordStrip";
import Section4 from "./Features/Section4";
import Link from "next/link";

const Footor: React.FC = () => {
  // Define state with type for mouse position
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Define type for event parameter
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 2;
    const y = ((clientY - top) / height - 0.5) * 2;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div id="about">
      <motion.div
        className="relative flex flex-col justify-center items-center mt-24"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000, borderRadius: "50%" }} // Radial boundary effect
      >
        {isHovered && (
          <motion.div
            className="absolute inset-0 z-0 pt-20"
            style={{
              background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 50}% ${(mousePosition.y + 0.5) * 50}%, rgba(150, 18, 163, 0.2), rgba(96, 170, 255, 0.2), rgba(255, 255, 255, 0.1))`,
              borderRadius: "50%", // Radial boundary effect
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
        <div className="flex flex-col justify-center items-center relative z-10 pt-32">
          <div className="lg:text-6xl md:text-5xl font-[600] text-white lg:w-[700px] md:w-[500px] w-[90vw] text-[9vw] text-center">
            Your Website, Built with AI
          </div>
          <div className="lg:w-[800px] w-[100vw]">
            <WordStrip
              words={[
                "Design   ",
                "Build   ",
                "Launch   ",
                "Innovate   ",
                "Create   ",
                "AI-powered   ",
                "Customizable   ",
                "Responsive",
                "Seamless    ",
                "Efficient    ",
                "Explore    ",
                "Innovate    ",
                "Inspire    ",
                "Achieve    ",
              ]}
            />
          </div>
          <motion.div
            className="button1 mt-20 relative"
            style={{ perspective: 1000, borderRadius: "50%" }} // Radial boundary effect
          >
            <Link href="/dashboard">
              <motion.button
                className="relative border-neutral-500 dark:border-slate-800 bg-gradient-to-r from-[#9612A3] via-[#9612A3] to-sky-700 hover:from-sky-700 hover:via-[#9612A3] hover:to-[#9612A3] lg:p-10 p-5 lg:text-4xl text-3xl rounded-full lg:w-[500px] md:w-[400px] w-[80vw]"
                style={{
                  transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg)`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
          <footer className="footer w-[100vw] text-base-content p-10 min-h-[80vh] bg-transparent flex justify-between">
            <aside>
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                className="fill-current"
              >
                <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
              </svg>
              <p className="text-lg">
                RapidSite AI Website Builder
                <br />
                Powering intelligent web creation since 2024
              </p>
            </aside>
            <div>
              <nav className="flex flex-col">
                <h6 className="footer-title text-white text-2xl">Services</h6>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  AI Design
                </a>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  Responsive Layouts
                </a>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  E-commerce Solutions
                </a>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  SEO Optimization
                </a>
              </nav>
              <nav className="flex flex-col">
                <h6 className="footer-title text-white text-2xl">Company</h6>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  About Us
                </a>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  Contact
                </a>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  Careers
                </a>
                <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                  Blog
                </a>
              </nav>
            </div>
            <nav>
              <h6 className="footer-title text-white text-2xl">Legal</h6>

              <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <br />
              <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <br />
              <a className="link link-hover py-2 text-lg hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </nav>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Footor;
