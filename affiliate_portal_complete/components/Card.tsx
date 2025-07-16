import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
} 