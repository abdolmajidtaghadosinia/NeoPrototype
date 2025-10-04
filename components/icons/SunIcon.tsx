import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const SunIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.8}
    className={className ?? 'h-5 w-5'}
    {...props}
  >
    <circle cx="12" cy="12" r="4.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.25v2.5m0 12.5v2.5m8.75-8.75h-2.5m-12.5 0h-2.5m15.47-6.22l-1.77 1.77m-9.9 9.9l-1.77 1.77m13.44 0l-1.77-1.77m-9.9-9.9-1.77-1.77" />
  </svg>
);
