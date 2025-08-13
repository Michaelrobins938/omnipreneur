import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass' | 'outline';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, variant = 'default', placeholder = "Enter text...", rows = 4, ...props }, ref) => {
    const baseClasses = `
      w-full px-4 py-3 text-sm text-white placeholder-zinc-400
      bg-zinc-900/50 border border-zinc-700 rounded-xl
      focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-950
      transition-all duration-200
      backdrop-blur-sm
      disabled:opacity-50 disabled:cursor-not-allowed
      resize-vertical min-h-[100px]
    `;

    const variantClasses = {
      default: 'bg-zinc-900/50 border-zinc-700 hover:border-zinc-600',
      glass: 'bg-zinc-800/30 border-zinc-600/50 backdrop-blur-md hover:border-zinc-500/50',
      outline: 'bg-transparent border-zinc-600 hover:border-zinc-500'
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };