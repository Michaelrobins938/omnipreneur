import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  variant?: 'default' | 'elevated' | 'subtle';
}

export default function Card({ 
  children, 
  className = '', 
  glow = false,
  variant = 'default'
}: CardProps) {
  const baseClasses = "backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all duration-300";
  
  const variants = {
    default: "bg-slate-800/50 hover:bg-slate-800/70 hover:border-slate-600/50",
    elevated: "bg-slate-800/70 hover:bg-slate-800/90 hover:border-slate-600/50 shadow-lg",
    subtle: "bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/30"
  };
  
  const glowClasses = glow ? "hover:shadow-lg hover:shadow-blue-500/10" : "hover:shadow-lg hover:shadow-slate-500/10";
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${glowClasses} ${className}`}>
      {children}
    </div>
  );
} 