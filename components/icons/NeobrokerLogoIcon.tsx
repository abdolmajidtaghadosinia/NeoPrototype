
import React from 'react';

export const NeobrokerLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 102 88" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Top Face */}
        <path d="M51 0 L0 29.44 L51 58.88 L102 29.44 Z" fill="#2C2C2E"/>
        {/* Left Face */}
        <path d="M0 29.44 L51 58.88 V88 L0 58.88 Z" fill="#131313"/>
        {/* Right Face */}
        <path d="M102 29.44 L51 58.88 V88 L102 58.88 Z" fill="#1C1C1E"/>
        
        {/* Faint line on the cube */}
        <path d="M17 65C23 62 36 55 45 56C54 57 57 53 63 52C70 51 81 54 85 52" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round"/>
        
        {/* The main green arrow */}
        <g>
            <path d="M22 62C28 59 41 52 50 53C59 54 62 50 68 49C75 48 86 51 90 49L100.5 21.5" stroke="#D7FE43" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M91.5 19L100.5 21.5L106.5 14L96.5 11.5Z" fill="#D7FE43" />
        </g>
    </svg>
);