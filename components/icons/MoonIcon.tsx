import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const MoonIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={1.8}
    className={className ?? 'h-5 w-5'}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12.79A8.75 8.75 0 0111.21 3 7.25 7.25 0 1019 18.79 8.78 8.78 0 0121 12.79z"
    />
  </svg>
);
