"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  animated?: boolean;
}

const StarBorder: React.FC<StarBorderProps> = ({
  children,
  className = '',
  size = 'md',
  color = '#06b6d4', // cyan-500
  animated = true
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const starSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const cornerStars = [
    { position: 'top-0 left-0', rotation: 'rotate-0' },
    { position: 'top-0 right-0', rotation: 'rotate-90' },
    { position: 'bottom-0 left-0', rotation: 'rotate-270' },
    { position: 'bottom-0 right-0', rotation: 'rotate-180' }
  ];

  const sideStars = [
    { position: 'top-1/2 left-0 transform -translate-y-1/2', rotation: 'rotate-0' },
    { position: 'top-1/2 right-0 transform -translate-y-1/2', rotation: 'rotate-180' },
    { position: 'top-0 left-1/2 transform -translate-x-1/2', rotation: 'rotate-270' },
    { position: 'bottom-0 left-1/2 transform -translate-x-1/2', rotation: 'rotate-90' }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Corner Stars */}
      {cornerStars.map((star, index) => (
        <motion.div
          key={`corner-${index}`}
          className={`absolute ${star.position} ${star.rotation}`}
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={animated ? { scale: 1.2, rotate: 360 } : {}}
        >
          <svg
            className={`${starSize[size]} text-cyan-400`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </motion.div>
      ))}

      {/* Side Stars */}
      {sideStars.map((star, index) => (
        <motion.div
          key={`side-${index}`}
          className={`absolute ${star.position} ${star.rotation}`}
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: (index + 4) * 0.1, duration: 0.5 }}
          whileHover={animated ? { scale: 1.2, rotate: 360 } : {}}
        >
          <svg
            className={`${starSize[size]} text-cyan-400/60`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </motion.div>
      ))}

      {/* Border Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          initial={animated ? { scaleX: 0 } : {}}
          animate={animated ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        
        {/* Bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
          initial={animated ? { scaleX: 0 } : {}}
          animate={animated ? { scaleX: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
        />
        
        {/* Left border */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
          initial={animated ? { scaleY: 0 } : {}}
          animate={animated ? { scaleY: 1 } : {}}
          transition={{ delay: 1.0, duration: 0.6 }}
        />
        
        {/* Right border */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
          initial={animated ? { scaleY: 0 } : {}}
          animate={animated ? { scaleY: 1 } : {}}
          transition={{ delay: 1.1, duration: 0.6 }}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 ${sizeClasses[size]}`}>
        {children}
      </div>
    </div>
  );
};

export default StarBorder; 