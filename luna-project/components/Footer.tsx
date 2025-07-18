'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Heart, 
  ArrowUp,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Instagram,
  Facebook
} from 'lucide-react'

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/luna', color: 'hover:text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/luna', color: 'hover:text-blue-600' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/luna', color: 'hover:text-gray-400' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/luna', color: 'hover:text-red-500' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/luna', color: 'hover:text-pink-500' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/luna', color: 'hover:text-blue-600' }
]

const contactInfo = [
  { icon: Mail, text: 'hello@luna.ai', href: 'mailto:hello@luna.ai' },
  { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, text: 'San Francisco, CA', href: '#' },
  { icon: Globe, text: 'www.luna.ai', href: 'https://luna.ai' }
]

const footerLinks = [
  {
    title: 'Products',
    links: [
      { name: 'NOVUS Protocol', href: '#novus-protocol' },
      { name: 'AutoRewrite Engine', href: '#auto-rewrite' },
      { name: 'Bundle Builder', href: '#bundle-builder' },
      { name: 'Content Spawner', href: '#content-spawner' },
      { name: 'Live Dashboard', href: '#dashboard' },
      { name: 'Affiliate Portal', href: '#affiliate-portal' }
    ]
  },
  {
    title: 'Solutions',
    links: [
      { name: 'For Creators', href: '#creators' },
      { name: 'For Businesses', href: '#businesses' },
      { name: 'For Agencies', href: '#agencies' },
      { name: 'Enterprise', href: '#enterprise' },
      { name: 'Startups', href: '#startups' },
      { name: 'Freelancers', href: '#freelancers' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Tutorials', href: '#tutorials' },
      { name: 'Blog', href: '#blog' },
      { name: 'Case Studies', href: '#case-studies' },
      { name: 'Help Center', href: '#help' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' },
      { name: 'Partners', href: '#partners' },
      { name: 'Contact', href: '#contact' },
      { name: 'Support', href: '#support' }
    ]
  }
]

const legalLinks = [
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms of Service', href: '#terms' },
  { name: 'Cookie Policy', href: '#cookies' },
  { name: 'GDPR Compliance', href: '#gdpr' },
  { name: 'Security', href: '#security' },
  { name: 'Accessibility', href: '#accessibility' }
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-zinc-950 border-t border-white/10">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.03),transparent_50%)]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href="/" className="flex items-center space-x-3 group mb-6">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)', rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Luna
                  </span>
                </Link>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Transform your business with cutting-edge AI tools. Generate viral content, optimize performance, and scale your operations with unprecedented efficiency.
                </p>
                <div className="space-y-3">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <motion.a
                        key={info.text}
                        href={info.href}
                        className="flex items-center space-x-3 text-zinc-400 hover:text-cyan-400 transition-colors duration-300 group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * index, duration: 0.6 }}
                      >
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm">{info.text}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerLinks.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index + 0.05 * linkIndex, duration: 0.6 }}
                    >
                      <Link
                        href={link.href}
                        className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300 text-sm group flex items-center space-x-1"
                      >
                        <span>{link.name}</span>
                        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              className="flex items-center space-x-2 text-zinc-400 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span>© 2024 Luna. All rights reserved.</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>in San Francisco</span>
              </span>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              className="flex flex-wrap items-center space-x-6 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center justify-center text-zinc-400 ${social.color} transition-all duration-300 hover:border-cyan-500/30 hover:bg-zinc-800/80`}
                    whileHover={{ scale: 1.1, y: -2, boxShadow: '0 10px 25px rgba(6, 182, 212, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + 0.1 * index, duration: 0.6 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  )
} 