import { cn } from "@/lib/utils";
import {
    IconAdjustmentsBolt,
    IconCloud,
    IconCurrencyDollar,
    IconEaseInOut,
    IconHeart,
    IconHelp,
    IconRouteAltLeft,
    IconTerminal2,
} from "@tabler/icons-react";
import React from 'react';

interface FeatureProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon, index }) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l border-neutral-800",
                index < 4 && "lg:border-b border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block  text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="text-sm  text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};

export default function Section1() {
    const features = [
        {
            title: "AI-Powered Design",
            description:
                "Automatically generate stunning website designs tailored to your brand's identity.",
            icon: <IconTerminal2 />,
        },
        {
            title: "User-Friendly Interface",
            description:
                "Building your website is as intuitive as drag-and-drop, no coding required.",
            icon: <IconEaseInOut />,
        },
        {
            title: "Flexible Pricing",
            description:
                "Choose a plan that fits your needs. No hidden fees, and no long-term commitments.",
            icon: <IconCurrencyDollar />,
        },
        {
            title: "Reliable Performance",
            description: "Enjoy fast loading times and 99.9% uptime for a smooth user experience.",
            icon: <IconCloud />,
        },
        {
            title: "Scalable Solutions",
            description: "Easily upgrade your website as your business grows without any hassle.",
            icon: <IconRouteAltLeft />,
        },
        {
            title: "24/7 Support",
            description:
                "Get instant help from our AI-driven support or connect with a human expert.",
            icon: <IconHelp />,
        },
        {
            title: "Money-Back Guarantee",
            description:
                "Try our service risk-free. If you're not satisfied, get a full refund within 30 days.",
            icon: <IconAdjustmentsBolt />,
        },
        {
            title: "And More...",
            description: "Explore countless other features designed to make your website stand out.",
            icon: <IconHeart />,
        },
    ];

    return (
        <div className="py-10 max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#8F4F96]">
                Key Features
            </h2>
            <p className="text-lg text-neutral-300 mt-2 mb-10">
                Discover the powerful tools and features that make building your website effortless.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
}
