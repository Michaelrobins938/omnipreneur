'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Scale,
  AlertTriangle,
  Shield,
  Mail,
  FileText
} from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-purple-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-zinc-400 mb-2">
              The legal agreement governing your use of Omnipreneur AI services.
            </p>
            <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Important Legal Notice</h3>
              <p className="text-amber-100 text-sm leading-relaxed">
                These Terms of Service constitute a legally binding agreement. By using our services, 
                you agree to be bound by these terms. Please read them carefully.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms Content - Simplified for now */}
        <div className="space-y-8">
          {/* Acceptance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-zinc-300">
              <p>By accessing or using Omnipreneur AI services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              <p>If you do not agree with any part of these terms, you are prohibited from using or accessing this service.</p>
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">2. Description of Services</h2>
            <div className="space-y-4 text-zinc-300">
              <p>Omnipreneur AI provides AI-powered content generation, marketing tools, and business automation services.</p>
              <p>We reserve the right to modify, suspend, or discontinue any part of our services at any time.</p>
            </div>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">3. User Responsibilities</h2>
            <div className="space-y-4 text-zinc-300">
              <p>You are responsible for maintaining the confidentiality of your account and password.</p>
              <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
              <p>You must not use our services to create harmful, illegal, or infringing content.</p>
            </div>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">4. Payment Terms</h2>
            <div className="space-y-4 text-zinc-300">
              <p>Subscription fees are charged in advance on a monthly or annual basis.</p>
              <p>All payments are processed securely through our payment provider Stripe.</p>
              <p>Refunds are handled on a case-by-case basis.</p>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">5. Intellectual Property</h2>
            <div className="space-y-4 text-zinc-300">
              <p>You retain ownership of content you create using our services.</p>
              <p>Our AI models, software, and platform technology remain our intellectual property.</p>
              <p>You must respect the intellectual property rights of others.</p>
            </div>
          </motion.div>

          {/* Disclaimers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">6. Disclaimers and Limitations</h2>
            <div className="space-y-4 text-zinc-300">
              <p>Our services are provided "as is" without warranties of any kind.</p>
              <p>We do not guarantee the accuracy or quality of AI-generated content.</p>
              <p>Our liability is limited to the amount paid for services in the preceding 12 months.</p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">7. Contact Information</h2>
            <div className="space-y-4 text-zinc-300">
              <p>If you have questions about these Terms of Service, please contact us:</p>
              <p>Email: legal@omnipreneur.ai</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mt-8"
        >
          <div className="text-center">
            <Scale className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-zinc-400 mb-6">
              Contact our legal team if you need clarification on any terms.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Legal Team
              </Link>
              
              <Link
                href="/legal/privacy"
                className="inline-flex items-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}