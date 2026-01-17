import React from 'react';

interface CoffeeBeanLineProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    strokeWidth?: number;
}

export const CoffeeBeanLine: React.FC<CoffeeBeanLineProps> = ({
    color = 'currentColor',
    strokeWidth = 1.5,
    className,
    ...props
}) => {
    return (
        <svg
            viewBox="0 0 200 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* 
        Approximate single-line path:
        Starts from left, waves in, forms the bean loop, does the center S-curve, and exits.
        This is a stylized representation.
      */}
            <path
                d="M0 60 C 20 60, 40 80, 60 80 C 75 80, 85 70, 90 60 C 95 50, 90 30, 100 20 C 115 5, 140 10, 150 30 C 160 50, 155 80, 140 95 C 125 110, 100 110, 85 95 C 75 85, 80 70, 90 60 C 100 50, 110 50, 115 65 C 120 80, 130 80, 140 80 C 160 80, 180 60, 200 60"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
