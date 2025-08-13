'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, FileText, Mail } from 'lucide-react';
import Link from 'next/link';

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">GDPR Compliance</h1>
          <p className="text-xl text-zinc-400">Your privacy rights and data protection</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-zinc prose-invert max-w-none"
        >
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50 space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Your Rights Under GDPR</h2>
              </div>
              <div className="text-zinc-300 space-y-4">
                <p>As a user of Omnipreneur services, you have the following rights under the General Data Protection Regulation (GDPR):</p>
                <ul className="list-disc list-inside space-y-2 text-zinc-400">
                  <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                  <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Data We Collect</h2>
              </div>
              <div className="text-zinc-300 space-y-4">
                <p>We collect and process the following types of personal data:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-zinc-900/50 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">Account Information</h3>
                    <ul className="text-zinc-400 text-sm space-y-1">
                      <li>• Email address</li>
                      <li>• Name</li>
                      <li>• Profile information</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">Usage Data</h3>
                    <ul className="text-zinc-400 text-sm space-y-1">
                      <li>• Platform interactions</li>
                      <li>• Content created</li>
                      <li>• Analytics data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">How We Protect Your Data</h2>
              </div>
              <div className="text-zinc-300 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard AES-256 encryption</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Access Controls:</strong> Strict access controls and authentication for all team members</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Data Minimization:</strong> We only collect data necessary for service provision</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Regular Audits:</strong> Quarterly security audits and compliance reviews</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Contact Our Data Protection Officer</h2>
              </div>
              <div className="text-zinc-300">
                <p className="mb-4">For any GDPR-related requests or concerns, contact our Data Protection Officer:</p>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p><strong>Email:</strong> <a href="mailto:dpo@omnipreneur.com" className="text-blue-400 hover:text-blue-300">dpo@omnipreneur.com</a></p>
                  <p><strong>Response Time:</strong> Within 30 days as required by GDPR</p>
                  <p><strong>Address:</strong> Dallas, Texas, USA</p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-700 pt-6">
              <p className="text-zinc-400 text-sm">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}<br/>
                <strong>Location:</strong> Made in Dallas, Texas, USA
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}