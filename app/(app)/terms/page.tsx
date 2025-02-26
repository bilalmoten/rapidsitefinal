"use client";

import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing or using RapidSite ("the Service"), you agree to be
              bound by these Terms of Service. If you disagree with any part of
              the terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Use of Service</h2>
            <h3 className="text-lg font-medium mb-2">2.1 Account Creation:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must notify us of any security breaches</li>
              <li>
                One person or entity may not maintain multiple free accounts
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-2">2.2 Acceptable Use:</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6">
              <li>Use the service for illegal purposes</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on others' intellectual property rights</li>
              <li>Upload malicious code or content</li>
              <li>Attempt to breach our security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              3. Intellectual Property
            </h2>
            <ul className="list-disc pl-6">
              <li>
                The Service and its original content are and will remain our
                property
              </li>
              <li>You retain ownership of your website content</li>
              <li>You grant us license to host and display your content</li>
              <li>
                We may use your feedback and suggestions without compensation
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              4. Service Modifications
            </h2>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6">
              <li>Modify or discontinue any part of the Service</li>
              <li>Change fees or pricing at any time</li>
              <li>Limit features or functionality for any user</li>
              <li>Update these terms at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              5. Limitation of Liability
            </h2>
            <p>
              We provide the Service "as is" without warranties of any kind. We
              are not liable for any damages arising from your use of the
              Service, including but not limited to direct, indirect,
              incidental, or consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              6. Account Termination
            </h2>
            <p>We may terminate or suspend your account if you:</p>
            <ul className="list-disc pl-6">
              <li>Violate these Terms</li>
              <li>Provide false information</li>
              <li>Engage in fraudulent activity</li>
              <li>Fail to pay applicable fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which we operate, without regard
              to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              8. Contact Information
            </h2>
            <p>
              For any questions about these Terms, please contact us at:{" "}
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
