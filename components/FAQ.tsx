import React from 'react';
import Accordion from './ui/Accordion';
import Section4 from './Features/Section4';

const FAQ: React.FC = () => {
    return (
        <div className='w-full flex flex-col justify-center items-center' id="FAQ">
            <div className='flex flex-col justify-center items-center mt-20 relative w-[90%] drop-shadow-xl bg-transparent'>
                <div className="keyFeatures w-full flex flex-col justify-center items-center">

                    <div className="text-white lg:text-6xl md:text-4xl text-[7vw] font-[800] lg:w-[800px] md:w-[600px] w-[100vw] text-center mt-10" style={{ opacity: 1 }}>
                        The AI Builder That Adapts to Your Needs.
                    </div>
                    <div className="text-gray-500 text-2xl mt-2 lg:w-[800px] md:w-[600px] w-[100vw] text-center">
                        Our AI website builder is continuously evolving to offer more features and flexibility. Below are some of the exciting features currently in development:
                    </div>
                    <div className="button1 mt-20">
                        <button className='hoverButton rounded-full'>
                            Join Our Community
                        </button>
                    </div>
                </div>
                <div className='lg:w-[800px] md:w-[600px] w-[90vw] mt-20 text-xl'>
                    <Accordion />
                </div>
            </div>
            {/* <Section4 /> */}
        </div>
    );
}

export default FAQ;
