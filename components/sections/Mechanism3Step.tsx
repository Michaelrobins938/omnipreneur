'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';
import { useReducedMotion } from '@/lib/utils/motion';

export default function Mechanism3Step() {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      number: '1',
      title: 'Generate',
      description: 'Create unlimited content, campaigns, and business assets with AI-powered generation tools.',
      icon: Sparkles,
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      number: '2',
      title: 'Automate',
      description: 'Set up intelligent workflows that handle everything from social media to affiliate management automatically.',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      number: '3',
      title: 'Optimize',
      description: 'Continuously improve performance with real-time analytics, A/B testing, and AI-driven insights.',
      icon: TrendingUp,
      gradient: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.3 : 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why This Works
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Three simple steps to transform your business with integrated AI systems.
          </p>
        </motion.div>

        <div className="space-y-12 md:space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={step.number}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                {/* Step Content */}
                <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}>
                  <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-xl">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{step.title}</h3>
                      <div className={`w-12 h-1 bg-gradient-to-r ${step.gradient} ${isEven ? 'md:ml-0' : 'md:ml-auto'} mx-auto md:mx-0`}></div>
                    </div>
                  </div>
                  <p className="text-lg text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Step Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className={`w-64 h-64 bg-gradient-to-br ${step.gradient} rounded-2xl p-8 flex items-center justify-center relative overflow-hidden`}>
                      <Icon className="w-24 h-24 text-white/90" />
                      
                      {/* Floating particles for visual interest */}
                      {!prefersReducedMotion && (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-white/30 rounded-full"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                              }}
                              animate={{
                                y: [-10, 10, -10],
                                opacity: [0.3, 0.8, 0.3],
                                scale: [0.8, 1.2, 0.8],
                              }}
                              transition={{
                                duration: 2 + Math.random(),
                                repeat: Infinity,
                                delay: Math.random() * 2,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                    
                    {/* Connection line to next step */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-zinc-600 to-zinc-800"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}