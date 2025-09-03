import React from 'react';

const SinaLogo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Main notebook/agenda shape */}
        <rect
          x="40"
          y="30"
          width="120"
          height="140"
          rx="15"
          ry="15"
          fill="#1e5a8a"
          stroke="#1e5a8a"
          strokeWidth="3"
        />
        
        {/* Inner white area */}
        <rect
          x="50"
          y="40"
          width="100"
          height="120"
          rx="8"
          ry="8"
          fill="white"
        />
        
        {/* Spiral binding on the left */}
        <rect x="20" y="50" width="8" height="8" rx="4" fill="#1e5a8a" />
        <rect x="20" y="70" width="8" height="8" rx="4" fill="#1e5a8a" />
        <rect x="20" y="90" width="8" height="8" rx="4" fill="#1e5a8a" />
        <rect x="20" y="110" width="8" height="8" rx="4" fill="#1e5a8a" />
        <rect x="20" y="130" width="8" height="8" rx="4" fill="#1e5a8a" />
        
        {/* Connecting lines for spiral */}
        <line x1="28" y1="54" x2="40" y2="54" stroke="#1e5a8a" strokeWidth="2" />
        <line x1="28" y1="74" x2="40" y2="74" stroke="#1e5a8a" strokeWidth="2" />
        <line x1="28" y1="94" x2="40" y2="94" stroke="#1e5a8a" strokeWidth="2" />
        <line x1="28" y1="114" x2="40" y2="114" stroke="#1e5a8a" strokeWidth="2" />
        <line x1="28" y1="134" x2="40" y2="134" stroke="#1e5a8a" strokeWidth="2" />
        
        {/* Student/person icon */}
        <circle cx="100" cy="80" r="12" fill="#1e5a8a" />
        <path
          d="M 85 95 Q 85 85 100 85 Q 115 85 115 95 L 115 105 Q 115 110 110 110 L 90 110 Q 85 110 85 105 Z"
          fill="#1e5a8a"
        />
        
        {/* Checkmark */}
        <path
          d="M 75 120 L 85 130 L 105 110"
          stroke="#1e5a8a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default SinaLogo;
