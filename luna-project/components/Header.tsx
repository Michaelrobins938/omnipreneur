'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Menu, 
  X, 
  Heart, 
  User, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Moon, 
  Target, 
  DollarSign, 
  Mail,
  Globe,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react'

const navigation = [
  {
    name: 'Products',
    href: '#products',
    icon: Target,
    current: true
  },
  {
    name: 'Solutions',
    href: '#solutions',
    icon: Users
  },
  {
    name: 'Pricing',
    href: '#pricing',
    icon: DollarSign
  },
  {
    name: 'About',
    href: '#about',
    icon: User
  },
  {
    name: 'Contact',
    href: '#contact',
    icon: Mail
  }
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="w-full flex justify-center pt-6 pb-4 bg-transparent sticky top-0 z-50">
      <nav className={`flex items-center justify-between w-full max-w-6xl px-6 py-3 rounded-full shadow-lg border-0 backdrop-blur-2xl gap-4 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-luna-900/80 border border-white/10' 
          : 'bg-white/60 dark:bg-luna-900/60'
      }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group pl-2 pr-4 py-2 rounded-full hover:bg-cyan-500/10 transition-all">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
          </div>
          <span className="text-2xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
            Omnipreneur
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-200 text-base ${
                  item.current
                    ? 'text-cyan-400 font-semibold bg-cyan-500/10'
                    : 'text-zinc-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Right side - Login and Mobile Menu */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-600 text-zinc-300 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-200 font-medium"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/get-started"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
          >
            <span>Get Started</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-luna-violet/10 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-cyan-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-cyan-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-cyan-500/10 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-luna-violet hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-luna-violet/10">
                <Link
                  href="/login"
                  className="w-full px-6 py-3 bg-luna-violet text-white rounded-full font-semibold flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 