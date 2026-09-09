import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const BoxmockLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="boxmock logo"
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#131418" stroke="#27272a" strokeWidth="1" />
      <rect x="6.25" y="3.75" width="11.5" height="16.5" rx="2.75" stroke="#fafafa" strokeWidth="1.4" />
      <circle cx="12" cy="6.2" r="0.9" fill="#38bdf8" />
      <line x1="10.2" y1="4.6" x2="13.8" y2="4.6" stroke="#71717a" strokeWidth="0.75" strokeLinecap="round" />
      <line x1="9.5" y1="18.3" x2="14.5" y2="18.3" stroke="#52525b" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
};
