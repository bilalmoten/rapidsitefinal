import { Metadata } from "next";
import DashboardBackground from "@/components/dashboard/DashboardBackground";

export const metadata: Metadata = {
  title: "Building in Public | RapidSite",
  description: "Follow our journey as we build and improve RapidSite",
};

interface Link {
  text: string;
  url: string;
}

interface UpdateItem {
  title: string;
  description: string;
  type: "feature" | "improvement" | "milestone";
  links?: Link[];
}

interface Update {
  date: string;
  title: string;
  description: string;
  milestone?: boolean;
  updates: UpdateItem[];
}

const updates: Update[] = [
  {
    date: "January 18, 2025",
    title: "Going Live! 🚀",
    description: "Removing waitlist and opening access to everyone",
    milestone: true,
    updates: [
      {
        title: "Waitlist Removal",
        description:
          "Opened RapidSite to everyone! No more waiting - create your AI-powered website instantly.",
        type: "milestone",
      },
      {
        title: "Infrastructure Scaling",
        description:
          "Significantly scaled our infrastructure to handle thousands of concurrent users with optimal performance.",
        type: "improvement",
      },
      {
        title: "Waitlist User Benefits",
        description:
          "Introduced special benefits for early waitlist supporters including priority support and early feature access.",
        type: "feature",
      },
    ],
  },
  {
    date: "January 18, 2025",
    title: "Dashboard Refresh & Coming Soon Features 🎨",
    description: "Major UI improvements and transparency updates",
    updates: [
      {
        title: "Dashboard UI Refresh",
        description:
          "Redesigned dashboard with a sleek right panel showing project stats and upcoming features.",
        type: "improvement",
      },
      {
        title: "Coming Soon Features Preview",
        description:
          "Added transparent 'Coming Soon' indicators for upcoming features like website analytics and AI assistant.",
        type: "improvement",
      },
      {
        title: "Responsive Layout Improvements",
        description:
          "Enhanced mobile responsiveness and smoother transitions for panel toggles.",
        type: "improvement",
      },
    ],
  },
  {
    date: "January 17, 2025",
    title: "Custom Domains Launch 🌐",
    description: "Introducing custom domain support for premium users",
    updates: [
      {
        title: "Custom Domain Support",
        description:
          "Premium users can now connect their own domains to their websites, providing a professional and branded experience for their visitors.",
        type: "feature",
      },
      {
        title: "Domain Management Interface",
        description:
          "New intuitive interface for managing custom domains, including easy DNS configuration and verification.",
        type: "feature",
      },
      {
        title: "Automatic SSL",
        description:
          "All custom domains automatically get SSL certificates for secure HTTPS connections.",
        type: "feature",
      },
    ],
  },
  {
    date: "January 12, 2025",
    title: "Enhanced Free Plan & Community Growth 🌱",
    description:
      "Introducing features to grow our community and improve user experience",
    updates: [
      {
        title: "Promotional Banner for Free Sites",
        description:
          "Added an elegant promotional banner to websites created with our free plan, helping spread the word about RapidSite while maintaining site aesthetics.",
        type: "feature",
      },
      {
        title: "User Plan Integration",
        description:
          "Enhanced our website rendering system to intelligently handle different user plans and their features.",
        type: "improvement",
      },
    ],
  },
  {
    date: "December 31, 2024",
    title: "Waitlist System Launch 🎟️",
    milestone: true,
    description:
      "Implemented a waitlist system to manage our growing user base",
    updates: [
      {
        title: "Waitlist System",
        description:
          "Introduced a waitlist system to ensure a smooth onboarding experience for new users. We'll be inviting users in batches to maintain service quality.",
        type: "feature",
      },
      {
        title: "Email Notifications",
        description:
          "Set up automated email notifications to keep waitlisted users informed about their status and position.",
        type: "improvement",
      },
    ],
  },
  {
    date: "December 31, 2024",
    title: "Analytics Integration & Tracking 📊",
    description:
      "Added comprehensive analytics to track and improve user experience",
    updates: [
      {
        title: "Google Analytics Integration",
        description:
          "Implemented Google Analytics 4 for better insights into user behavior and website performance",
        type: "feature",
      },
      {
        title: "AI Interaction Tracking",
        description:
          "Added detailed tracking for AI chat sessions and AI-powered edits, including message lengths and edit types",
        type: "improvement",
      },
      {
        title: "Performance Monitoring",
        description:
          "Set up analytics to monitor website generation times, edit success rates, and user engagement patterns",
        type: "improvement",
      },
    ],
  },
  {
    date: "December 30, 2024",
    title: "Roadmap & Navigation Improvements 🎯",
    description:
      "Major updates to help you track our progress and navigate better!",
    updates: [
      {
        title: "Public Roadmap Launch",
        description:
          "Launched an interactive roadmap where you can view upcoming features, suggest new ones, and vote on community suggestions.",
        type: "feature",
        links: [{ text: "View Roadmap", url: "/roadmap" }],
      },
      {
        title: "Navigation Enhancements",
        description:
          "Added quick access to Roadmap, Changelog, and upcoming features in the dashboard sidebar.",
        type: "improvement",
      },
      {
        title: "Footer Updates",
        description:
          "Reorganized footer with new links to Terms of Service, Privacy Policy, and Journey pages.",
        type: "improvement",
      },
      {
        title: "Company Information",
        description:
          "Added About Us and Contact pages with comprehensive company information and contact details.",
        type: "improvement",
        links: [
          { text: "About Us", url: "/about" },
          { text: "Contact", url: "/contact" },
        ],
      },
    ],
  },
  {
    date: "December 29, 2023",
    title: "Enhanced Security & User Experience 🔒",
    description: "Added important security features to protect your account!",
    updates: [
      {
        title: "Password Reset Feature",
        description:
          "Implemented a secure password reset flow, making it easy to regain access to your account if you forget your password.",
        type: "feature",
      },
      {
        title: "Improved Authentication",
        description:
          "Enhanced the authentication system with better security measures and user-friendly flows.",
        type: "improvement",
      },
    ],
  },
  {
    date: "December 28, 2023",
    title: "Making Things Better & More Secure 🛠️",
    description:
      "Small but important improvements to make your experience better!",
    updates: [
      {
        title: "Dark Mode Refinements",
        description:
          "Fixed dark mode styling on login and signup pages for better visibility.",
        type: "improvement",
      },
      {
        title: "Better Password Support",
        description:
          "Updated password validation to allow more special characters, making it easier to use your preferred password.",
        type: "improvement",
      },
      {
        title: "Streamlined Landing Page",
        description:
          "Reduced the default number of FAQs showing on the landing page for a cleaner look.",
        type: "improvement",
      },
      {
        title: "Legal Framework",
        description:
          "Added Terms of Service and Privacy Policy to protect both you and us.",
        type: "feature",
        links: [
          { text: "Terms of Service", url: "/terms" },
          { text: "Privacy Policy", url: "/privacy-policy" },
        ],
      },
    ],
  },
  {
    date: "December 25, 2023",
    title: "🚀 Official Launch!",
    description: "Excited to finally share RapidSite with the world!",
    milestone: true,
    updates: [
      {
        title: "Public Launch",
        description:
          "RapidSite is now officially available to everyone! After months of development and testing, we're excited to help you build your dream websites.",
        type: "milestone",
      },
    ],
  },
];

export default function Journey() {
  return (
    <div>
      <DashboardBackground />
      <div className="min-h-screen bg-primary-dark/30 relative z-20">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-10">
              Building in Public
            </h1>
            <p className="mt-4 text-lg text-neutral-30">
              Follow our journey as we build and improve RapidSite. Every
              update, no matter how small, is a step forward. 🚀
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {updates.map((update, index) => (
              <div key={index} className="relative">
                {index !== updates.length - 1 && (
                  <div
                    className="absolute top-12 left-4 -ml-px h-full w-0.5 bg-neutral-70"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start group">
                  <span className="h-9 flex items-center">
                    <span
                      className={`relative z-10 w-8 h-8 flex items-center justify-center ${
                        update.milestone ? "bg-primary-main" : "bg-primary-dark"
                      } rounded-full ring-8 ring-[#0a0a0b]`}
                    >
                      <span className="h-2.5 w-2.5 bg-neutral-10 rounded-full" />
                    </span>
                  </span>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="text-sm font-semibold text-neutral-30 mb-1">
                      {update.date}
                    </div>
                    <div className="text-xl font-bold text-neutral-10 mb-2">
                      {update.title}
                    </div>
                    <div className="text-neutral-30 mb-4">
                      {update.description}
                    </div>
                    <div className="space-y-4">
                      {update.updates.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="bg-neutral-90/50 rounded-lg p-4 border border-neutral-70"
                        >
                          <h3 className="text-base font-semibold text-neutral-10 flex items-center">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                item.type === "feature"
                                  ? "bg-primary-main"
                                  : item.type === "milestone"
                                  ? "bg-primary-main"
                                  : "bg-primary-dark"
                              }`}
                            ></span>
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm text-neutral-30">
                            {item.description}
                          </p>
                          {item.links && (
                            <div className="mt-3 flex gap-3">
                              {item.links.map((link, i) => (
                                <a
                                  key={i}
                                  href={link.url}
                                  className="text-sm text-primary-main hover:text-primary-main/80"
                                >
                                  {link.text} →
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
