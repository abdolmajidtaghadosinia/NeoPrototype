
import React from 'react';

export const OrderBookDisplayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        <rect x="10" y="7" width="4" height="2" fill="red" stroke="none" />
        <rect x="8" y="11.5" width="8" height="2" fill="green" stroke="none" />
        <rect x="10" y="16" width="4" height="2" fill="green" stroke="none" />
    </svg>
);
