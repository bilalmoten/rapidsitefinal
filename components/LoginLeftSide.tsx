"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect1";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";

export function CanvasRevealEffectDemo3() {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="h-[40rem] flex flex-col lg:flex-row overflow-hidden items-center justify-center bg-[#030014] w-full gap-4 mx-auto px-8 relative"
        >
            <div>
                <div className="logo flex flex-col items-center">
                    <Image src={"/image1.png"} width={150} height={150} alt="Logo" style={{ opacity: 1 }} className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto mt-4" />
                    <p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto mt-4">
                        AI Website is best, and take rest
                    </p>
                </div>
                <div className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto mt-4 flex gap-3 justify-center">
                    <FaFacebookF className="text-white w-6 h-6 cursor-pointer" />
                    <FaInstagram className="text-white w-6 h-6 cursor-pointer" />
                    <FaLinkedinIn className="text-white w-6 h-6 cursor-pointer" />
                    <FaTwitter className="text-white w-6 h-6 cursor-pointer" />
                    <FaYoutube className="text-white w-6 h-6 cursor-pointer" />
                </div>
            </div>
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full w-full absolute inset-0"
                    >
                        <CanvasRevealEffect
                            animationSpeed={5}
                            containerClassName="bg-transparent"
                            colors={[
                                [59, 130, 246],
                                [139, 92, 246],
                            ]}
                            opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
                            dotSize={2}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Radial gradient for the cute fade */}
            <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
        </div>
    );
}
         