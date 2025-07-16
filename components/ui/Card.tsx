import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = `
      rounded-xl p-6 md:p-8
      transition-all duration-300 ease-out
      hover:scale-[1.01] hover:shadow-lg
    `;

    const variantClasses = {
      default: `
        bg-zinc-950 border border-zinc-800
        hover:border-zinc-700 hover:shadow-zinc-900/20
      `,
      glass: `
        bg-zinc-900/50 backdrop-blur-md border border-zinc-700/50
        hover:bg-zinc-900/70 hover:border-zinc-600/50
        shadow-glass hover:shadow-glass-lg
      `,
      gradient: `
        bg-zinc-950 border border-gradient-to-br from-indigo-500 to-purple-600
        hover:from-indigo-400 hover:to-purple-500
        shadow-lg hover:shadow-glow
        relative overflow-hidden
      `,
      elevated: `
        bg-zinc-900 border border-zinc-700
        hover:bg-zinc-800 hover:border-zinc-600
        shadow-xl hover:shadow-2xl
        transform hover:-translate-y-1
      `,
    };

    return (
      <div
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${className || ''}
        `}
        {...props}
      >
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
export type { CardProps }; 