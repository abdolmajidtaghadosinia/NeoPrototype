import React from 'react';

export const StockMarketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="11.25" fill="#2C2C2E" stroke="#4A4A4A" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M6 17l4.5-6 3 3 5.25-7.5M18.75 6.5v4m0-4h-4" />
    </svg>
);
