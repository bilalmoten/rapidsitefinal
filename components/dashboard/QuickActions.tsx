"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, Zap, Layout } from "lucide-react";
import NewWebsiteDialog from "@/components/NewWebsiteDialog";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  userId: string;
  toggleAIAssistant: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userId,
  toggleAIAssistant,
}) => {
  const router = useRouter();

  const actions = [
    {
      icon: <PlusCircle className="h-6 w-6" />,
      title: "New Project",
      description: "Start a new website project",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Assistant",
      description: "Get help from our AI",
      onClick: toggleAIAssistant,
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Inspiration",
      description: "Browse our gallery of AI-created websites",
      onClick: () => router.push("/inspiration"),
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              <NewWebsiteDialog userId={userId}>
                <motion.div
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start space-x-4 cursor-pointer hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </motion.div>
              </NewWebsiteDialog>
            ) : (
              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start space-x-4 cursor-pointer hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={action.onClick}
              >
                <div className="bg-primary text-primary-foreground p-2 rounded-full">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
