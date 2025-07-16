import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <motion.footer
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-xl",
          className
        )}
        {...(props as any)}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-300 bg-clip-text text-transparent">
                AI Enterprise
              </h3>
              <p className="text-gray-400 text-sm">
                Transforming businesses with cutting-edge AI solutions.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <motion.a
                    key={social}
                    href={`https://${social}.com`}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                      {social === 'twitter' && '𝕏'}
                      {social === 'linkedin' && 'in'}
                      {social === 'github' && '⌥'}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Products</h4>
              <ul className="space-y-2 text-sm">
                {[
                  'Codebase Search',
                  'AutoRewrite Engine',
                  'Bundle Builder',
                  'Content Spawner'
                ].map((product) => (
                  <li key={product}>
                    <Link 
                      href={`/tools/${product.toLowerCase().replace(' ', '-')}`}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {product}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Press', href: '/press' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: 'Documentation', href: '/docs' },
                  { name: 'Help Center', href: '/help' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Status', href: '/status' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AI Enterprise. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    )
  }
)
Footer.displayName = "Footer"

export { Footer } 