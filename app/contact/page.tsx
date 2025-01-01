"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground">
            We would love to hear from you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a
                    href="mailto:bilal@aiwebsitebuilder.tech"
                    className="text-muted-foreground hover:text-primary"
                  >
                    bilal@aiwebsitebuilder.tech
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    A-14 Al-Rehman Premier Apartments
                    <br />
                    Block-16 Gulshan-e-Iqbal
                    <br />
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <a
                    href="tel:+923351379362"
                    className="text-muted-foreground hover:text-primary"
                  >
                    +92 335 1379362
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Twitter className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Twitter</h3>
                  <a
                    href="https://twitter.com/bilal_4oct"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    @bilal_4oct
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Company Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Company Name</h3>
                <p className="text-muted-foreground">Nisa Technologies</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Owner</h3>
                <p className="text-muted-foreground">Muhammad Bilal Moten</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Website</h3>
                <a
                  href="https://answerai.tech"
                  className="text-muted-foreground hover:text-primary"
                >
                  answerai.tech
                </a>
              </div>
              <div>
                <h3 className="font-medium mb-1">Additional Contact</h3>
                <div className="space-y-1">
                  <a
                    href="mailto:bilalmoten2@gmail.com"
                    className="block text-muted-foreground hover:text-primary"
                  >
                    bilalmoten2@gmail.com
                  </a>
                  <a
                    href="mailto:bilal.usstore.4oct@gmail.com"
                    className="block text-muted-foreground hover:text-primary"
                  >
                    bilal.usstore.4oct@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
