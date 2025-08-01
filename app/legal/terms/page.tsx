"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFileContract, FaGavel, FaShieldAlt, FaUserCheck } from 'react-icons/fa';

export default function TermsOfService() {
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaFileContract className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">Acceptance of Terms</h2>
              <p className="text-zinc-400 mb-6">
                By accessing and using Omnipreneur AI Suite services, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Use License</h2>
              <p className="text-zinc-400 mb-6">
                Permission is granted to temporarily download one copy of the materials (information or software) 
                on Omnipreneur AI Suite's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-zinc-400 mb-8">
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="text-zinc-400 mb-8 space-y-2">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on the website</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
                <li>• Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Service Description</h2>
              <p className="text-zinc-400 mb-6">
                Omnipreneur AI Suite provides AI-powered content generation, rewriting, and optimization services. 
                Our services include but are not limited to:
              </p>
              <ul className="text-zinc-400 mb-8 space-y-2">
                <li>• AutoRewrite Engine™ - Content refinement and optimization</li>
                <li>• Content Spawner™ - Viral content generation</li>
                <li>• Bundle Builder™ - Product packaging and optimization</li>
                <li>• Live Dashboard™ - Analytics and performance tracking</li>
                <li>• Affiliate Portal™ - Referral and commission management</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">User Responsibilities</h2>
              <p className="text-zinc-400 mb-6">
                You are responsible for:
              </p>
              <ul className="text-zinc-400 mb-8 space-y-2">
                <li>• Maintaining the confidentiality of your account credentials</li>
                <li>• All activities that occur under your account</li>
                <li>• Ensuring your use of our services complies with applicable laws</li>
                <li>• Not using our services for any illegal or unauthorized purpose</li>
                <li>• Not interfering with or disrupting the service or servers</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">Payment Terms</h2>
              <p className="text-zinc-400 mb-6">
                Subscription fees are billed in advance on a monthly or annual basis. All payments are 
                non-refundable except as required by law. We reserve the right to modify our pricing 
                with 30 days notice.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property</h2>
              <p className="text-zinc-400 mb-6">
                The service and its original content, features, and functionality are and will remain the 
                exclusive property of Omnipreneur AI Suite and its licensors. The service is protected by 
                copyright, trademark, and other laws.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Limitation of Liability</h2>
              <p className="text-zinc-400 mb-6">
                In no event shall Omnipreneur AI Suite, nor its directors, employees, partners, agents, 
                suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Termination</h2>
              <p className="text-zinc-400 mb-6">
                We may terminate or suspend your account and bar access to the service immediately, without 
                prior notice or liability, under our sole discretion, for any reason whatsoever and without 
                limitation, including but not limited to a breach of the Terms.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">Governing Law</h2>
              <p className="text-zinc-400 mb-8">
                These Terms shall be interpreted and governed by the laws of the State of California, 
                without regard to its conflict of law provisions.
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