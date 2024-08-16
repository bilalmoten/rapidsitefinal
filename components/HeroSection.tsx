"use client";
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import HoverBorderGradient from './ui/gradientBorder';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import { CardBody, CardContainer, CardItem } from './ui/TDCard';

import Marquee from './Marquree';
import HeaderLine from './ui/HeaderLine';
import Section1 from './HeroSection/Section1';
import Link from 'next/link';

const HeroSection1: React.FC = () => {
    gsap.registerPlugin(ScrollTrigger);
    
    const fullText = "Create any type of website effortlessly with AI. Input your needs, and let our platform handle the rest.";
    const [displayedText, setDisplayedText] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.brefContainer',
                start: 'top top',
                end: "+=1800px",
                pin: true,
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress * 2;
                    const length = Math.round(progress * fullText.length);
                    setDisplayedText(fullText.substring(0, length));
                    if (progress >= 1 && ref.current) {
                        ref.current.style.height = "100px";
                    }
                },
            },
        });
    });

    return (
        <div className='flex flex-col justify-center items-center' id='home'>
            <Section1 />
            <Marquee />
            <div className="brefContainer text-white h-[1800px] bg-[#030014] relative" ref={ref}>
                <HeaderLine text={"Bref Intro."} />

                <div className="">
                    <div className='w-[100vw] p-10 text-white'>
                        <div className='text-5xl px-10 font-[200]' style={{fontWeight: 400 }}>
                            {displayedText}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex">
                            <CardContainer className="inter-var -mt-20 sideCards" isScale={true}>
                                <CardBody className="relative group/card hover:shadow-7xl border-white/[0.5] w-[400px] h-[350px] rounded-xl p-6 border shadow-[#F7D8FF]">
                                    <CardItem
                                        translateZ={50}
                                        className="text-2xl font-bold text-neutral-200 text-center flex justify-center"
                                    >
                                        <div>
                                            Effortless AI Design
                                        </div>
                                    </CardItem>
                                    
                                    <CardItem translateZ={100} className="w-full mt-4">
                                        <Image
                                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            height={200}
                                            width={200}
                                            className="h-[200px] w-[200px] object-cover group-hover/card:shadow-xl rounded-full"
                                            alt="thumbnail"
                                        />
                                    </CardItem>
                                    <div className="flex justify-between items-center mt-5">
                                        <CardItem
                                            translateZ={20}
                                            className="px-4 py-2 rounded-xl dark:text-black text-white text-xs font-bold"
                                        >
                                            <div className="ml-[85px]">
                                                <HoverBorderGradient
                                                    className={'w-[150px] ml-[cal(50% - 75px)]'}
                                                >
                                                    <Link href={'/dashboard'} >Get Started</Link>
                                                </HoverBorderGradient>
                                            </div>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>

                            <CardContainer className="inter-var -mt-20">
                                <CardBody className="relative group/card hover:shadow-4xl border-white/[0.5] w-[400px] h-[350px] rounded-xl p-6 border">
                                    <CardItem
                                        translateZ={50}
                                        className="text-2xl font-bold text-neutral-200 text-center flex justify-center"
                                    >
                                        <div>
                                            Instant AI Websites
                                        </div>
                                    </CardItem>
                                    
                                    <CardItem translateZ={100} className="w-full mt-4">
                                        <Image
                                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            height={200}
                                            width={200}
                                            className="h-[200px] w-[200px] object-cover group-hover/card:shadow-xl rounded-full"
                                            alt="thumbnail"
                                        />
                                    </CardItem>
                                    <div className="flex justify-between items-center mt-5">
                                        <CardItem
                                            translateZ={20}
                                            className="px-4 py-2 rounded-xl text-white text-xs font-bold"
                                        >
                                            <div className="ml-[85px]">
                                                <HoverBorderGradient
                                                    className={'w-[150px] ml-[cal(50% - 75px)]'}
                                                >
                                                    Get Started
                                                </HoverBorderGradient>
                                            </div>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>

                            <CardContainer className="inter-var -mt-20 sideCards" isScale={true}>
                                <CardBody className="relative group/card hover:shadow-7xl border-white/[0.5] w-[400px] h-[350px] rounded-xl p-6 border shadow-[#F7D8FF]">
                                    <CardItem
                                        translateZ={50}
                                        className="text-2xl font-bold text-neutral-200 text-center flex justify-center"
                                    >
                                        <div>
                                            Smart Website Creation
                                        </div>
                                    </CardItem>
                                    
                                    <CardItem translateZ={100} className="w-full mt-4">
                                        <Image
                                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            height={200}
                                            width={200}
                                            className="h-[200px] w-[200px] object-cover group-hover/card:shadow-xl rounded-full"
                                            alt="thumbnail"
                                        />
                                    </CardItem>
                                    <div className="flex justify-between items-center mt-5">
                                        <CardItem
                                            translateZ={20}
                                            className="px-4 py-2 rounded-xl dark:text-black text-white text-xs font-bold"
                                        >
                                            <div className="ml-[85px]">
                                                <HoverBorderGradient
                                                    className={'w-[150px] ml-[cal(50% - 75px)]'}
                                                >
                                                    Get Started
                                                </HoverBorderGradient>
                                            </div>
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection1;
