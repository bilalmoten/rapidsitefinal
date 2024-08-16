import React, { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { animationArray } from '@/lib/animationArray';
import { PlaceholdersAndVanishInput } from '../ui/placeholder';
import HeroSection from '../HeroSection';
import Section4 from '../Features/Section4';

const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a JavaScript method to reverse a string",
    "How to assemble your own PC?",
];

const Section1: React.FC = () => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitted");
    };

    return (
        <div className='h-[120vh] relative bg-[#030014]'>

            <div className="hero h-[900px] relative bg-[#030014]">
                <div className="hero-content flex-col">
                    <a href="#ai" className="hero-badge">
                        <Image src={'/shinging.svg'} width={40} height={40} alt="AI Badge" />
                        <div className="hero-badge-text">
                            New: Our AI Generated Websites
                        </div>
                    </a>
                    <div className="section-header">
                        <h1 className="section-header-title section-header-title-h1 text-6xl mb-5 font-[700]">
                            <div className="section-header-title-desktop">
                                <span>Think better with Reflect</span>
                            </div>
                        </h1>
                    </div>
                    <p className="hero-description">Your Vision, Our Tools – Build Stunning Websites Today</p>
                </div>
                <div className="hero-black-hole hero-black-hole-visible">
                    <div>
                        <video preload="false" autoPlay muted loop src="https://reflect.app/home/build/q-c3d7becf.webm"></video>
                    </div>
                    <div className="hero-black-hole-circles">
                        <div>
                            <div className="hero-black-hole-circle hero-black-hole-circle-0">
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        className="hero-black-hole-circle-dot"
                                        onMouseEnter={() => {
                                            // JavaScript function for onMouseEnter event
                                        }}
                                        key={index}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="hero-black-hole-circle hero-black-hole-circle-1">
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        className="hero-black-hole-circle-dot"
                                        onMouseEnter={() => {
                                            // JavaScript function for onMouseEnter event
                                        }}
                                        key={index}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hero-black-hole-stars">
                        {animationArray.map((star, index) => (
                            <div
                                key={index}
                                style={{
                                    animationDuration: `${star.duration}s`,
                                    animationDelay: `${star.delay}s`,
                                    top: `${star.top}%`,
                                    left: `${star.left}%`,
                                    transform: star.transform,
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="bgBackDropDiv w-[1000px] flex flex-col items-center h-[400px] pt-10 mt-[240px]" style={{ zIndex: 99990 }}>
                        <div className="w-[600px]">
                            <PlaceholdersAndVanishInput
                                placeholders={placeholders}
                                onChange={handleChange}
                                onSubmit={onSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section1;
