import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}

export default function Input({ 
  placeholder = "Enter text...", 
  value, 
  onChange, 
  className = '',
  type = "text"
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg
        text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
        transition-all duration-300
        backdrop-blur-sm
        ${className}
      `}
    />
  );
} 