import React from 'react';

const BWT: React.FC = () => {
    return (
        <div className='w-full px-5 py-5'>
            <div className="heading font-[700] text-[22px] pb-10">AI Tips</div>
            <div className='flex gap-5 flex-wrap'>
                <div className="box bg-[#E3D1E8] lg:p-5 p-2 lg:w-[35vw] w-[90vw] rounded-xl h-[90px] flex items-center justify-between">
                    <div>
                        <div className="heading font-[700] lg:text-[16px] text-[12px]">Use AI to generate text</div>
                        <div className="heading font-[400] lg:text-[16px] text-[12px] text-[#8F4F96] md:text-[16px]">Try it out in the ChatGPT plugin</div>
                    </div>
                    <button className="bg-[#9612A3] h-[40px] lg:h-[40px] text-white rounded-xl md:w-[100px] w-[90px] text-[10px] md:text-[15px] lg:text-[16px]">
                        Open Plugin
                    </button>
                </div>
                <div className="box bg-[#E3D1E8] lg:p-5 p-2 lg:w-[35vw] w-[90vw] rounded-xl h-[90px] flex items-center justify-between">
                    <div>
                        <div className="heading font-[700] lg:text-[16px] text-[12px]">Use AI to generate text</div>
                        <div className="heading font-[400] lg:text-[16px] text-[12px] text-[#8F4F96] md:text-[16px]">Try it out in the ChatGPT plugin</div>
                    </div>
                    <button className="bg-[#9612A3] h-[40px] lg:h-[40px] text-white rounded-xl md:w-[100px] w-[90px] text-[10px] md:text-[15px] lg:text-[16px]">
                        Open Plugin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BWT;
