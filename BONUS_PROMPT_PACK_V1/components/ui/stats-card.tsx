import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, description, icon, trend, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/20",
          className
        )}
        {...props}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            {icon && (
              <div className="text-2xl text-blue-400">
                {icon}
              </div>
            )}
            {trend && (
              <div className={cn(
                "flex items-center text-sm font-medium",
                trend.isPositive ? "text-green-400" : "text-red-400"
              )}>
                <span>{trend.isPositive ? "↗" : "↘"}</span>
                <span className="ml-1">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-white"
            >
              {typeof value === "number" ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {value.toLocaleString()}
                </motion.span>
              ) : (
                value
              )}
            </motion.div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-300 mb-1">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-gray-400">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    )
  }
)
StatsCard.displayName = "StatsCard"

export { StatsCard } 