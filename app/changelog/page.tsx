import { Metadata } from "next";

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
    date: "December 31, 2023",
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
        title: "Custom Event Tracking",
        description:
          "Added detailed event tracking for website creation, AI interactions, and user authentication",
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Building in Public
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Follow our journey as we build and improve RapidSite. Every update,
            no matter how small, is a step forward. 🚀
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {updates.map((update, index) => (
            <div key={index} className="relative">
              {index !== updates.length - 1 && (
                <div
                  className="absolute top-12 left-4 -ml-px h-full w-0.5 bg-border"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start group">
                <span className="h-9 flex items-center">
                  <span
                    className={`relative z-10 w-8 h-8 flex items-center justify-center ${
                      update.milestone ? "bg-yellow-500" : "bg-primary"
                    } rounded-full`}
                  >
                    <span className="h-2.5 w-2.5 bg-white rounded-full" />
                  </span>
                </span>
                <div className="ml-4 min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {update.date}
                  </div>
                  <div className="text-xl font-bold text-foreground mb-2">
                    {update.title}
                  </div>
                  <div className="text-muted-foreground mb-4">
                    {update.description}
                  </div>
                  <div className="space-y-4">
                    {update.updates.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-card rounded-lg p-4 shadow-sm"
                      >
                        <h3 className="text-base font-semibold text-foreground flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              item.type === "feature"
                                ? "bg-green-500"
                                : item.type === "milestone"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }`}
                          ></span>
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        {item.links && (
                          <div className="mt-3 flex gap-3">
                            {item.links.map((link, i) => (
                              <a
                                key={i}
                                href={link.url}
                                className="text-sm text-primary hover:text-primary/80"
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
  );
}
