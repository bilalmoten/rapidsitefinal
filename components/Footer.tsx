import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
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
