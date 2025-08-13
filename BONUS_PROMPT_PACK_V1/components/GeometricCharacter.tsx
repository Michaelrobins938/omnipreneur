import React from 'react';

interface GeometricCharacterProps {
  className?: string;
}

const GeometricCharacter: React.FC<GeometricCharacterProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Base Shape */}
        <path
          d="M100 20 
             C130 20, 160 50, 160 100
             C160 150, 130 180, 100 180
             C70 180, 40 150, 40 100
             C40 50, 70 20, 100 20"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Eyes */}
        <circle cx="70" cy="90" r="15" fill="black" />
        <circle cx="130" cy="90" r="15" fill="black" />
        
        {/* Geometric Patterns */}
        <path
          d="M60 140 L140 140"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Additional Geometric Details */}
        <path
          d="M40 70 L60 50 L80 70"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M120 70 L140 50 L160 70"
          stroke="black"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default GeometricCharacter; 