'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Clock, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: 1,
    title: 'Create Your Account',
    description: 'Sign up in under 30 seconds with just your email',
    action: 'Sign Up Free',
    href: '/auth/register',
    icon: Users,
    color: 'from-blue-500 to-purple-500'
  },
  {
    number: 2,
    title: 'Choose Your Tools',
    description: 'Pick from 27 AI tools or start with our recommended bundle',
    action: 'Browse Tools',
    href: '/products',
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  },
  {
    number: 3,
    title: 'See Results',
    description: 'Watch your business scale with automated workflows',
    action: 'View Demo',
    href: '/demo',
    icon: CheckCircle,
    color: 'from-green-500 to-blue-500'
  }
];

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get Started with Omnipreneur
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Join 50,000+ businesses scaling with AI. Set up takes less than 5 minutes.
          </p>
          
          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-300">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span>2-minute setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Free forever plan</span>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
              >
                {/* Step Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} text-center`}>
                  <div className={`inline-flex items-center space-x-4 mb-6 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {step.number}
                    </div>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">{step.title}</h2>
                  <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto md:mx-0">{step.description}</p>
                  
                  <Link href={step.href}>
                    <button className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${step.color} text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                      <span>{step.action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                {/* Step Visual */}
                <div className="flex-1 flex justify-center">
                  <div className={`relative w-64 h-64 bg-gradient-to-br ${step.color} rounded-2xl p-8 flex items-center justify-center overflow-hidden`}>
                    <Icon className="w-24 h-24 text-white/90" />
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/20 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-4 w-2 h-2 bg-white/20 rounded-full" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20 bg-zinc-800/30 rounded-3xl p-12 border border-zinc-700/50"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've automated their way to success
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 group">
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span>Start Free Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/case-studies">
              <button className="px-10 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>See Success Stories</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}