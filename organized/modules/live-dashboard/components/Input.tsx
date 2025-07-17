import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  icon?: React.ReactNode;
}

export default function Input({ 
  placeholder = "Enter text...", 
  value, 
  onChange, 
  className = '',
  type = "text",
  icon
}: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl
          text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-300
          backdrop-blur-sm
          ${icon ? 'pl-12' : ''}
        `}
      />
    </div>
  );
} 