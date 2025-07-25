import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow-glow-blue",
        secondary:
          "border-transparent bg-gray-800 text-gray-300",
        destructive:
          "border-transparent bg-red-500 text-white shadow-glow-red",
        outline: "text-blue-500 border-blue-500",
        success:
          "border-transparent bg-green-600 text-white shadow-glow-green",
        warning:
          "border-transparent bg-yellow-600 text-white shadow-glow-yellow",
        info:
          "border-transparent bg-cyan-600 text-white shadow-glow-cyan",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 