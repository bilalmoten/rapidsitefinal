"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";

// Define the type for the FeatureCardProps
interface FeatureCardProps {
    children: React.ReactNode;
    className: string;
}

// Define the type for the Feature object
interface Feature {
    title: string;
    description: string;
    skeleton: React.ReactNode;
    className: string;
}

export default function FeaturesSectionDemo() {
    const features: Feature[] = [
        {
            title: "Track issues effectively",
            description:
                "Track and manage your project issues with ease using our intuitive interface.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r border-neutral-800",
        },
        {
            title: "Capture pictures with AI",
            description:
                "Capture stunning photos effortlessly using our advanced AI technology.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 border-neutral-800",
        },
        {
            title: "Watch our AI on YouTube",
            description:
                "Whether its you or Tyler Durden, you can get to know about our product on YouTube",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r  border-neutral-800",
        },
        {
            title: "Deploy in seconds",
            description:
                "With our blazing fast, state of the art, cutting edge, we are so back cloud servies (read AWS) - you can deploy your model in seconds.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none",
        },
    ];

    return (
        <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
                    Showcase of Beautifully Crafted Websites
                </h4>

                <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto  text-center font-normal text-neutral-300">
                    Explore examples of stunning websites created with our AI builder. Find inspiration and see how our templates can bring your vision to life.
                </p>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-neutral-800">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className="h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard: React.FC<FeatureCardProps> = ({ children, className }) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug">
            {children}
        </p>
    );
};

const FeatureDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base max-w-4xl text-left mx-auto",
                "text-neutral-500 text-center font-normal ",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne: React.FC = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full p-5 mx-auto  bg-neutral-900 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2">
                    {/* TODO */}
                    <Image
                        src="/image01.PNG"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t  from-black  via-black to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b  from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree: React.FC = () => {
    return (
        <Link
            href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
            target="__blank"
            className="relative flex gap-10 h-full group/image"
        >
            <div className="w-full mx-auto  bg-transparent group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
                    {/* TODO */}
                    <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto" />
                    <Image
                        src="/image09.PNG"
                        alt="header"
                        width={800}
                        height={800}
                        className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
                    />
                </div>
            </div>
        </Link>
    );
};

export const SkeletonTwo: React.FC = () => {
    const images = [
        "/image02.PNG",
        "/image03.PNG",
        "/image04.PNG",
        "/image05.PNG",
        "/image06.PNG",
        "/image07.PNG",
        "/image08.PNG",
    ];

    const imageVariants = {
        whileHover: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
        whileTap: {
            scale: 1.1,
            rotate: 0,
            zIndex: 100,
        },
    };

    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
            {/* TODO */}
            <div className="flex flex-row -ml-20">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1 bg-neutral-800 border-neutral-700 border  flex-shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt="bali images"
                            width={500}
                            height={500}
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                        />
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-row">
                {images.map((image, idx) => (
                    <motion.div
                        key={"images-second" + idx}
                        style={{
                            rotate: Math.random() * 20 - 10,
                        }}
                        variants={imageVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="rounded-xl -mr-4 mt-4 p-1  bg-neutral-800 border-neutral-700 border  flex-shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt="bali images"
                            width={500}
                            height={500}
                            className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                        />
                    </motion.div>
                ))}
            </div>

            <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r  from-black to-transparent h-full pointer-events-none" />
            <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l  from-black to-transparent h-full pointer-events-none" />
        </div>
    );
};

export const SkeletonFour: React.FC = () => {
    return (
        <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent  mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

interface GlobeProps {
    className?: string;
}

export const Globe: React.FC<GlobeProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <div>
            <div className="relative flex py-8 px-2 gap-10 h-full">
                <div className="w-full p-5 mx-auto  bg-neutral-900 shadow-2xl group h-full">
                    <div className="flex flex-1 w-full h-full flex-col space-y-2">
                        {/* TODO */}
                        <Image
                            src="/image04.PNG"
                            alt="header"
                            width={800}
                            height={800}
                            className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t  from-black  via-black to-transparent w-full pointer-events-none" />
                <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b  from-black via-transparent to-transparent w-full pointer-events-none" />
            </div>
        </div>
    );
};
