'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Server, AlertTriangle, CheckCircle, Key } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
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
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Security</h1>
          <p className="text-xl text-zinc-400">Enterprise-grade security for your data and business</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Security Certifications */}
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Security Certifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">SOC 2 Type II</h3>
                <p className="text-zinc-400 text-sm">Audited for security, availability, and confidentiality</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">ISO 27001</h3>
                <p className="text-zinc-400 text-sm">Information security management certified</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">GDPR Compliant</h3>
                <p className="text-zinc-400 text-sm">Full compliance with European data protection</p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Data Protection</h2>
            </div>
            <div className="space-y-4 text-zinc-300">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Key className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">End-to-End Encryption</h3>
                  <p className="text-zinc-400">All data is encrypted using AES-256 encryption both in transit and at rest. Your content is secure from creation to storage.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Server className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Infrastructure Security</h3>
                  <p className="text-zinc-400">Hosted on AWS with enterprise-grade security controls, including VPC isolation, WAF protection, and DDoS mitigation.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Access Controls</h3>
                  <p className="text-zinc-400">Multi-factor authentication, role-based access controls, and regular access reviews ensure only authorized access.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring & Response */}
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">24/7 Monitoring & Response</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-3">Real-Time Monitoring</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>24/7 security operations center (SOC)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Automated threat detection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span>Intrusion prevention systems</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span>Log analysis and correlation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Incident Response</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span>&lt; 15 minute response time</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span>Automated containment procedures</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span>Forensic investigation capabilities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full" />
                    <span>Customer notification protocols</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Practices */}
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Our Security Practices</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-white mb-4">Development Security</h3>
                <div className="space-y-3 text-zinc-400">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Secure code review processes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Automated vulnerability scanning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Penetration testing quarterly</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Security training for all developers</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Operational Security</h3>
                <div className="space-y-3 text-zinc-400">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Regular security audits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Employee background checks</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Secure development lifecycle</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>Incident response procedures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50">
            <h2 className="text-2xl font-bold text-white mb-4">Security Contact</h2>
            <div className="text-zinc-300">
              <p className="mb-4">Report security vulnerabilities or concerns to our security team:</p>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p><strong>Security Email:</strong> <a href="mailto:security@omnipreneur.com" className="text-blue-400 hover:text-blue-300">security@omnipreneur.com</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>PGP Key:</strong> Available on request</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-700 pt-6">
            <p className="text-zinc-400 text-sm text-center">
              <strong>Made in Dallas, Texas, USA</strong> • Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}