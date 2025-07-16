import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = '', glow = false }: CardProps) {
  const baseClasses = "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:border-gray-600/50";
  const glowClasses = glow ? "hover:shadow-lg hover:shadow-cyan-500/10" : "hover:shadow-lg hover:shadow-gray-500/10";
  
  return (
    <div className={`${baseClasses} ${glowClasses} ${className}`}>
      {children}
    </div>
  );
} 