import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
      className
    );

    const variantClasses = {
      primary: cn(
        'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
        'hover:from-indigo-700 hover:to-purple-700',
        'active:from-indigo-800 active:to-purple-800',
        'shadow-lg hover:shadow-glow',
        'border border-transparent'
      ),
      secondary: cn(
        'bg-zinc-800 text-zinc-100',
        'hover:bg-zinc-700',
        'active:bg-zinc-600',
        'border border-zinc-700',
        'hover:border-zinc-600'
      ),
      danger: cn(
        'bg-gradient-to-r from-red-600 to-pink-600 text-white',
        'hover:from-red-700 hover:to-pink-700',
        'active:from-red-800 active:to-pink-800',
        'shadow-lg hover:shadow-red-500/25',
        'border border-transparent'
      ),
      ghost: cn(
        'bg-transparent text-zinc-300',
        'hover:bg-zinc-800 hover:text-white',
        'active:bg-zinc-700',
        'border border-transparent'
      ),
      outline: cn(
        'bg-transparent text-zinc-300',
        'border border-zinc-600',
        'hover:border-indigo-500 hover:text-indigo-400',
        'active:border-indigo-600',
        'hover:bg-zinc-800/50'
      ),
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm rounded-lg',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-xl',
      xl: 'h-14 px-8 text-lg rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loading && 'cursor-wait'
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          </div>
        )}
        <span className={cn(loading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps }; 