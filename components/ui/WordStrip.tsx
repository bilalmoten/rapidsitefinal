import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Define the type for the component's props
interface WordStripProps {
    words: string[];
}

const WordStrip: React.FC<WordStripProps> = ({ words }) => {
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const wordWidth = 100; // Estimate word width for calculating scroll length
            const gap = 20; // Space between words
            const totalWidth = container.scrollWidth;
            const duration = totalWidth / 50; // Adjust speed as needed

            controls.start({
                x: `-${totalWidth}px`,
                transition: { duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }
            });
        }
    }, [controls]);

    const wordString = words.join('            ');
    const duplicateWordString = `${wordString}    ${wordString}`;

    return (
        <div className="word-strip-container">
            <motion.div
                ref={containerRef}
                className="word-strip"
                animate={controls}
                initial={{ x: 0 }}
            >
                <div className="word-strip-content">
                    <span>{duplicateWordString}</span>
                    <span>{duplicateWordString}</span> {/* Duplicate to ensure smooth scrolling */}
                </div>
            </motion.div>
        </div>
    );
};

export default WordStrip;
