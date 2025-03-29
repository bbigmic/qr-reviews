import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-8 w-auto" }: LogoProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Tło QR kodu */}
        <rect x="20" y="20" width="60" height="60" rx="8" className="fill-blue-500" />
        
        {/* Elementy QR kodu */}
        <rect x="30" y="30" width="10" height="10" fill="white" />
        <rect x="60" y="30" width="10" height="10" fill="white" />
        <rect x="30" y="60" width="10" height="10" fill="white" />
        <rect x="45" y="45" width="10" height="10" fill="white" />
        
        {/* Gwiazdka recenzji */}
        <path
          d="M85 35l-5.774 3.09 1.107-6.545-4.666-4.59 6.444-.947L85 20l2.889 6.008 6.444.947-4.666 4.59 1.107 6.545z"
          fill="#FFD700"
          className="animate-pulse"
        />
        
        {/* Tekst "QR" */}
        <text
          x="42"
          y="55"
          className="fill-white font-bold text-xs"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          QR
        </text>
      </svg>
    </div>
  );
} 