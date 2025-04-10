"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SocialLink {
  name: string;
  href: string;
  icon: (props: any) => JSX.Element;
}

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Roadmap", href: "#features" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const socialLinks: SocialLink[] = [];

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Star className="h-8 w-8 text-purple-500" />
              </motion.div>
              <span className="text-xl font-bold">
                RapidSite AI Website Builder
              </span>
            </Link>
            <p className="text-muted-foreground">
              Empowering creators to build their digital dreams.
            </p>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-muted-foreground text-sm">
            © 2024 RapidSite AI Website Builder. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {socialLinks.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
