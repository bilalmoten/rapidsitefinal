"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Search,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = ["All", "General", "Features", "Pricing", "Technical"];

// Define a type for our FAQ structure
type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedQuestions: string[];
};

const faqs: FAQ[] = [
  {
    id: "customization",
    question: "How customizable are the AI-generated websites?",
    answer:
      "Our AI-generated websites are highly customizable. You can adjust every aspect of the design, from layout to colors, using our intuitive editor or through natural language commands to our AI.",
    category: "Features",
    relatedQuestions: ["code-editing", "color-scheme"],
  },
  {
    id: "code-editing",
    question: "Can I edit the code directly?",
    answer:
      "No, you cannot edit the code directly. Our AI-powered platform is designed to be user-friendly for everyone, regardless of technical background.",
    category: "Features",
    relatedQuestions: ["customization", "css-customization"],
  },
  {
    id: "color-scheme",
    question: "How do I change the color scheme?",
    answer:
      "You can easily change the color scheme through our visual editor or by telling the AI your preferred colors. The AI will automatically adjust all elements to maintain visual harmony.",
    category: "Features",
    relatedQuestions: ["customization", "css-customization"],
  },
  {
    id: "domain-setup",
    question: "How does the free domain setup work?",
    answer:
      "Every website you create comes with a free subdomain. You can also easily connect your own custom domain if you prefer.",
    category: "Technical",
    relatedQuestions: ["use-own-domain", "set-up-ssl"],
  },
  {
    id: "support",
    question: "What kind of support is available?",
    answer:
      "We offer 24/7 AI-powered chat support, comprehensive documentation, and a vibrant community forum for all your questions and needs.",
    category: "General",
    relatedQuestions: ["contact-support", "response-time"],
  },
  {
    id: "website-types",
    question: "What types of websites can I currently build?",
    answer:
      "Currently, our AI website builder specializes in creating simple yet professional informational and marketing websites. This includes landing pages, portfolio sites, and basic business websites. Complex features like e-commerce, booking systems, or dynamic blogs are not supported in our current version.",
    category: "Features",
    relatedQuestions: ["features-coming-soon", "upgrade-later"],
  },
  {
    id: "build-time",
    question: "How long does it take to build a website?",
    answer:
      "With our AI-powered platform, you can have a basic website up and running in as little as 10-15 minutes. Simply describe what you want, and our AI will generate a customizable website template that matches your needs.",
    category: "General",
    relatedQuestions: ["ai-generation-work", "make-changes-after-generation"],
  },
  {
    id: "limitations",
    question: "What are the current limitations?",
    answer:
      "Our platform currently focuses on static websites and doesn't support complex functionalities like e-commerce, user authentication, or dynamic content management. We're actively working on expanding these capabilities in future updates.",
    category: "Technical",
    relatedQuestions: ["new-features-available", "add-custom-functionality"],
  },
  {
    id: "export-code",
    question: "Can I export my website's code?",
    answer:
      "Yes! You can export your website's code and host it anywhere you prefer. The exported code is clean, well-structured, and follows modern web development practices.",
    category: "Technical",
    relatedQuestions: ["hosting-options", "deploy-website"],
  },
  {
    id: "future-roadmap",
    question: "What's on the future roadmap?",
    answer:
      "We're actively working on adding support for e-commerce functionality, dynamic blogs, booking systems, and more complex interactive features. Our goal is to gradually expand capabilities while maintaining our user-friendly approach.",
    category: "Features",
    relatedQuestions: ["when-will-these-features-be-available", "stay-updated"],
  },
  {
    id: "css-customization",
    question: "Can I add custom CSS?",
    answer:
      "Yes, you can add custom CSS to your website. Our AI-powered platform allows you to customize the design using natural language commands and our visual editor.",
    category: "Features",
    relatedQuestions: ["customization", "code-editing"],
  },
  {
    id: "use-own-domain",
    question: "Can I use my own domain?",
    answer:
      "Yes, you can use your own domain with our platform. Simply connect your custom domain to your website through our domain management tool.",
    category: "Technical",
    relatedQuestions: ["domain-setup", "set-up-ssl"],
  },
  {
    id: "set-up-ssl",
    question: "How do I set up SSL?",
    answer:
      "You can set up SSL for your website through our platform. Simply follow our step-by-step guide to configure SSL for your website.",
    category: "Technical",
    relatedQuestions: ["domain-setup", "use-own-domain"],
  },
  {
    id: "contact-support",
    question: "How do I contact support?",
    answer:
      "You can contact our support team through our AI-powered chat support tool. Simply click on the chat icon in the bottom right corner of the screen to start a conversation with our support team.",
    category: "General",
    relatedQuestions: ["support", "response-time"],
  },
  {
    id: "response-time",
    question: "What's the response time?",
    answer:
      "Our AI-powered chat support tool provides real-time responses. You can expect a response from our support team within minutes during business hours.",
    category: "General",
    relatedQuestions: ["contact-support", "support"],
  },
  {
    id: "features-coming-soon",
    question: "What features are coming soon?",
    answer:
      "We're constantly working on adding new features to our platform. You can stay updated by following our blog and social media channels.",
    category: "Features",
    relatedQuestions: ["future-roadmap", "stay-updated"],
  },
  {
    id: "upgrade-later",
    question: "Can I upgrade later?",
    answer:
      "Yes, you can upgrade to a paid plan at any time. Our platform offers a free trial period to help you evaluate our features and services.",
    category: "Features",
    relatedQuestions: ["future-roadmap", "upgrade-now"],
  },
  {
    id: "ai-generation-work",
    question: "How does the AI generation work?",
    answer:
      "Our AI-powered platform uses advanced machine learning algorithms to generate websites. You simply describe what you want, and our AI will generate a customizable website template that matches your needs.",
    category: "Features",
    relatedQuestions: ["build-time", "make-changes-after-generation"],
  },
  {
    id: "make-changes-after-generation",
    question: "Can I make changes after generation?",
    answer:
      "Yes, you can make changes to your website after generation. Our AI-powered platform allows you to edit the code directly or through natural language commands to our AI.",
    category: "Features",
    relatedQuestions: ["code-editing", "ai-generation-work"],
  },
  {
    id: "new-features-available",
    question: "When will new features be available?",
    answer:
      "We're constantly working on adding new features to our platform. You can stay updated by following our blog and social media channels.",
    category: "Features",
    relatedQuestions: ["future-roadmap", "stay-updated"],
  },
  {
    id: "add-custom-functionality",
    question: "Can I add custom functionality?",
    answer:
      "Yes, you can add custom functionality to your website. Our AI-powered platform allows you to customize the design using natural language commands and our visual editor.",
    category: "Features",
    relatedQuestions: ["limitations", "new-features-available"],
  },
  {
    id: "hosting-options",
    question: "What hosting options are available?",
    answer:
      "We offer a variety of hosting options for your website. You can choose from our cloud hosting platform or integrate with your existing hosting provider.",
    category: "Technical",
    relatedQuestions: ["export-code", "deploy-website"],
  },
  {
    id: "deploy-website",
    question: "How do I deploy my website?",
    answer:
      "You can deploy your website through our platform. Simply follow our step-by-step guide to deploy your website.",
    category: "Technical",
    relatedQuestions: ["export-code", "hosting-options"],
  },
  {
    id: "upgrade-now",
    question: "Can I upgrade now?",
    answer:
      "Yes, you can upgrade to a paid plan at any time. Our platform offers a free trial period to help you evaluate our features and services.",
    category: "Features",
    relatedQuestions: ["upgrade-later", "upgrade-now"],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [helpfulResponses, setHelpfulResponses] = useState<
    Record<string, boolean>
  >({});

  const handleRelatedQuestionClick = (faqId: string) => {
    const faq = faqs.find((f) => f.id === faqId);
    if (faq) {
      setActiveQuestion(faqId);
      setActiveCategory(faq.category);
      // Smooth scroll to the question
      const element = document.getElementById(`faq-${faqId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    setHelpfulResponses((prev) => ({ ...prev, [faqId]: isHelpful }));
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Frequently Asked{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Questions
          </span>
        </motion.h2>

        {/* Search and Filter */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-500/10"
                )}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq) => (
            <motion.div
              key={faq.id}
              id={`faq-${faq.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
            >
              <motion.button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() =>
                  setActiveQuestion(activeQuestion === faq.id ? null : faq.id)
                }
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
              >
                <span className="font-semibold">{faq.question}</span>
                {activeQuestion === faq.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </motion.button>

              <AnimatePresence>
                {activeQuestion === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 overflow-hidden"
                  >
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {faq.answer}
                    </p>

                    {/* Related Questions */}
                    {faq.relatedQuestions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Related Questions:
                        </p>
                        <ul className="space-y-2">
                          {faq.relatedQuestions.map((relatedId) => {
                            const relatedFaq = faqs.find(
                              (f) => f.id === relatedId
                            );
                            return relatedFaq ? (
                              <li
                                key={relatedId}
                                onClick={() =>
                                  handleRelatedQuestionClick(relatedId)
                                }
                                className="text-sm text-purple-500 hover:text-purple-600 cursor-pointer transition-colors"
                              >
                                {relatedFaq.question}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="flex items-center gap-4 pb-6 text-sm text-gray-500">
                      <span>Was this helpful?</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFeedback(faq.id, true)}
                        className={cn(
                          "p-2 rounded-full",
                          helpfulResponses[faq.id] === true
                            ? "text-green-500 bg-green-500/10"
                            : "hover:text-green-500"
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFeedback(faq.id, false)}
                        className={cn(
                          "p-2 rounded-full",
                          helpfulResponses[faq.id] === false
                            ? "text-red-500 bg-red-500/10"
                            : "hover:text-red-500"
                        )}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
