import React from 'react';
import Section1 from './Section1';
import Section3 from './Section2';
import Section5 from './Section5';

const Features1: React.FC = () => {
    return (
        <div className='bg-[#030014] relative' id='features'>
            <Section1 />
            {/* <Section2 /> */}
            <Section3 />
            <Section5 />
            {/* <Features /> */}
        </div>
    );
}

export default Features1;
