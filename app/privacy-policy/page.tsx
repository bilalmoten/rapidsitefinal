"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              RapidSite ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, and
              share your information when you use our website builder service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-lg font-medium mb-2">
              2.1 Information you provide:
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Email address and account credentials</li>
              <li>Website content and configurations</li>
              <li>Communication preferences</li>
              <li>
                Payment information (processed securely by our payment
                providers)
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-2">
              2.2 Automatically collected information:
            </h3>
            <ul className="list-disc pl-6">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6">
              <li>To provide and improve our services</li>
              <li>To communicate with you about your account</li>
              <li>To process payments and prevent fraud</li>
              <li>To analyze and improve our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Data Sharing and Third Parties
            </h2>
            <p>We share your information with:</p>
            <ul className="list-disc pl-6">
              <li>Supabase - for database and authentication services</li>
              <li>Google - for authentication (when using Google Sign-In)</li>
              <li>Service providers - for hosting, analytics, and support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no internet
              transmission is completely secure, and we cannot guarantee the
              security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:{" "}
              <a
                href="mailto:support@rapidai.website"
                className="text-indigo-600 hover:text-indigo-500"
              >
                support@rapidai.website
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
