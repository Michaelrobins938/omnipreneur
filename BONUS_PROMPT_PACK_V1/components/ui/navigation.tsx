import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface NavigationItem {
  label: string
  href: string
  description?: string
}

interface NavigationProps {
  items: NavigationItem[]
  className?: string
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ items, className, ...props }, ref) => {
    const [activeItem, setActiveItem] = React.useState<string | null>(null)

    return (
      <motion.nav
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative z-50 w-full border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">
                AI Enterprise
              </Link>
            </motion.div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {items.map((item) => (
                <motion.div
                  key={item.href}
                  onHoverStart={() => setActiveItem(item.href)}
                  onHoverEnd={() => setActiveItem(null)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors hover:text-blue-400",
                      activeItem === item.href ? "text-blue-400" : "text-gray-300"
                    )}
                  >
                    {item.label}
                    {activeItem === item.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-blue-500/10 border border-blue-500/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Link>
                  
                  {item.description && activeItem === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-gray-700 bg-gray-900/95 backdrop-blur-xl p-3 shadow-xl"
                    >
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    )
  }
)
Navigation.displayName = "Navigation"

export { Navigation } 