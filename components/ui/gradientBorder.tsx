"use client";
import React, { useState, MouseEvent, ElementType } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverBorderGradientProps {
    children: React.ReactNode;
    containerClassName?: string;
    className?: string;
    as?: ElementType;
    duration?: number;
    clockwise?: boolean;
    [key: string]: any; // for any additional props
}

export function HoverBorderGradient({
    children,
    containerClassName,
    className,
    as: Tag = "button",
    duration = 0.5,
    clockwise = true,
    ...props
}: HoverBorderGradientProps) {
    const [hovered, setHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = ((clientX - left) / width - 0.5) * 2;
        const y = ((clientY - top) / height - 0.5) * 2;
        setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => {
        setHovered(false);
        setMousePosition({ x: 0, y: 0 });
    };

    const baseGradient = "bg-gradient-to-r from-[#9612A3] via-[#9612A3] to-sky-700";
    const hoverGradient = `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, rgba(255, 255, 255, 0.5) 0%, rgba(96, 170, 255, 0.3) 20px, transparent 40px)`;

    return (
        <Tag
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative flex rounded-full border content-center transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px w-fit",
                containerClassName
            )}
            {...props}
        >
            <motion.div
                className={cn(
                    "relative w-auto text-white z-10 px-4 py-2 rounded-[inherit]",
                    className,
                    baseGradient
                )}
                animate={{
                    rotateX: mousePosition.y * -30,
                    rotateY: mousePosition.x * 30,
                }}
                transition={{ duration: 0.1 }}
            >
                {children}
            </motion.div>
            <motion.div
                className={cn("absolute inset-0 overflow-hidden z-0 rounded-[inherit]")}
                style={{
                    filter: "blur(5px)",
                    position: "absolute",
                    width: "101%",
                    height: "101%",
                    background: baseGradient
                }}
            />
            {hovered && (
                <motion.div
                    className="absolute inset-0 z-10"
                    style={{
                        background: hoverGradient,
                        mixBlendMode: "screen",
                        borderRadius: '20px'
                    }}
                />
            )}
            <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[inherit]" />
        </Tag>
    );
}

export default HoverBorderGradient;
