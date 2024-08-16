"use client";
import React, { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

// Define the type for an accordion item
interface AccordionItem {
    title: string;
    content: string;
}

const Accordion: React.FC = () => {
    // Define state with type number | null to allow activeIndex to be null or a number
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Define the type for the index parameter as a number
    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Define the accordion data with the AccordionItem type
    const accordionData: AccordionItem[] = [
        {
            title: "What is an AI Website Builder?",
            content: "An AI website builder is a tool that uses artificial intelligence to help you create a website quickly and easily. It automates design and development processes based on the content and preferences you provide."
        },
        {
            title: "How does the AI choose a template?",
            content: "The AI analyzes the information you input, such as your industry, content, and design preferences, to suggest a template that best fits your needs. You can then customize it further to match your brand."
        },
        {
            title: "Can I customize the design?",
            content: "Absolutely! While the AI provides a great starting point, you can fully customize the layout, colors, fonts, and features to create a website that reflects your unique brand identity."
        },
        {
            title: "Is coding knowledge required?",
            content: "No, you don't need any coding skills. The AI website builder is designed for ease of use, allowing you to build a professional-looking website without writing a single line of code."
        },
        {
            title: "What features can I add?",
            content: "You can add a wide range of features, including contact forms, e-commerce capabilities, social media integration, and more. The AI will guide you through adding these elements effortlessly."
        },
        {
            title: "Is my website mobile-friendly?",
            content: "Yes, the AI ensures that your website is responsive and looks great on all devices, including mobile phones and tablets. You can preview how your site will appear across different screen sizes."
        }
    ];

    return (
        <>
            {accordionData.map((item, index) => (
                <div className="relative mb-3 text-white" key={index}>
                    <h6 className="mb-3 border border-white rounded-xl bg-gray-700 transition-all duration-300 hover:bg-gray-900">
                        <button
                            className="relative flex items-center w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-white rounded-t-1 group text-dark-500"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span>{item.title}</span>
                            <div className='absolute right-10 pt-1 text-xs'>
                                {activeIndex !== index ? <FaPlus /> : <FaMinus />}
                            </div>
                        </button>
                    </h6>
                    <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === index ? 'h-auto' : 'h-0'}`}
                    >
                        <div className="p-4 text-sm leading-normal text-blue-gray-500/80">
                            {item.content}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Accordion;
