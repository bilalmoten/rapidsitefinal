import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

// Define the type for the props
interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    vertical?: boolean;
    repeat?: number;
    children: React.ReactNode;
}

const Marquee: React.FC<MarqueeProps> = ({
    className,
    reverse = false,
    pauseOnHover = false,
    vertical = false,
    repeat = 4,
    children,
    ...props
}) => {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                },
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                            "animate-marquee flex-row": !vertical,
                            "animate-marquee-vertical flex-col": vertical,
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                            "animate-marquee-reverse": reverse && !vertical,
                            "animate-marquee-vertical-reverse": reverse && vertical,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
};

export default Marquee;
