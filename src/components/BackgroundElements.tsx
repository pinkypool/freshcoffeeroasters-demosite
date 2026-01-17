import React from 'react';
import { Icons } from './Icons';

const BackgroundElements: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top Right */}
            <div className="absolute -top-20 -right-20 opacity-[0.03] transform rotate-12">
                <Icons.CoffeeBeanLine width={600} height={600} color="#000" />
            </div>

            {/* Bottom Left */}
            <div className="absolute -bottom-32 -left-20 opacity-[0.03] transform -rotate-12">
                <Icons.CoffeeBeanLine width={700} height={700} color="#000" />
            </div>

            {/* Middle Right - smaller */}
            <div className="absolute top-1/2 -right-32 opacity-[0.02] transform rotate-45">
                <Icons.CoffeeBeanLine width={400} height={400} color="#000" />
            </div>
        </div>
    );
};

export default BackgroundElements;
