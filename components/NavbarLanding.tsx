"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HoverBorderGradient } from './ui/gradientBorder';
import Link from 'next/link';


const Navbar: React.FC = () => {
    const [isScroll, setIsScroll] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScroll(true);
            } else {
                setIsScroll(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='navbar h-[100px] flex justify-center items-center px-10' style={{ zIndex: 99999999 }}>
            <div className="flex justify-between w-full">
                <Image
                    src={'/image1.png'}
                    className="logo w-[60px] h-[60px] rounded-full"
                    width={60}
                    height={60}
                    alt="Logo"
                />
                <div className={`${isScroll ? "bglinks" : ""} linkSection hidden lg:flex backdrop-blur-md border border-gray-500 justify-center items-center rounded-full`}>
                    <ul className='flex justify-center items-center h-[50px]'>
                        <Link className='px-5 links text-white text-xl flex justify-center items-center' href={"#home"}>Home</Link>
                        <Link className='px-5 links text-white text-xl flex justify-center items-center' href={"#features"}>Features</Link>
                        <Link className='px-5 links text-white text-xl flex justify-center items-center' href={"#FAQ"}>FAQ</Link>
                        <Link className='px-5 links text-white text-xl flex justify-center items-center' href={"#about"}>About US</Link>
                    </ul>
                </div>
                <div className="button1">
                    <Link href={'/dashboard'} >
                        <HoverBorderGradient
                            className={'w-[150px]'}
                        >
                            Get Started
                        </HoverBorderGradient>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
