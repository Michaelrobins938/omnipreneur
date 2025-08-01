"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaEye, FaDatabase, FaUserCheck } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Your privacy is our priority. Learn how we protect and handle your data.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">Information We Collect</h2>
              <p className="text-zinc-400 mb-6">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This may include:
              </p>
              <ul className="text-zinc-400 mb-8 space-y-2">
                <li>• Name and contact information</li>
                <li>• Account credentials</li>
                <li>• Usage data and analytics</li>
                <li>• Communication preferences</li>
                <li>• Payment information (processed securely by third-party providers)</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">How We Use Your Information</h2>
              <p className="text-zinc-400 mb-6">
                We use the information we collect to:
              </p>
              <ul className="text-zinc-400 mb-8 space-y-2">
                <li>• Provide and improve our services</li>
                <li>• Process transactions and send related information</li>
                <li>• Send technical notices and support messages</li>
                <li>• Respond to your comments and questions</li>
                <li>• Communicate with you about products, services, and events</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Data Security</h2>
              <p className="text-zinc-400 mb-6">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Data Sharing</h2>
              <p className="text-zinc-400 mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                except as described in this policy or with your consent.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Your Rights</h2>
              <p className="text-zinc-400 mb-6">
                You have the right to:
              </p>
              <ul className="text-zinc-400 mb-8 space-y-2">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Request deletion of your data</li>
                <li>• Opt out of marketing communications</li>
                <li>• Lodge a complaint with supervisory authorities</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              <p className="text-zinc-400 mb-8">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@omnipreneur.ai" className="text-cyan-400 hover:text-cyan-300">
                  privacy@omnipreneur.ai
                </a>
              </p>

              <div className="mt-12 pt-8 border-t border-zinc-700">
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 