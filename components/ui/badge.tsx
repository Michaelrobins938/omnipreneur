import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'border-transparent bg-zinc-700 text-zinc-200 hover:bg-zinc-600',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'border-zinc-600 text-zinc-300 hover:bg-zinc-800',
        success: 'border-transparent bg-green-600 text-white hover:bg-green-700',
        warning: 'border-transparent bg-yellow-600 text-black hover:bg-yellow-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };