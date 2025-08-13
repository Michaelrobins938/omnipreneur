"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MethodologyStep = memo(({ icon, step, description }) => (
  <div className="flex items-start space-x-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold text-blue-400 mb-2">{step}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
));

MethodologyStep.displayName = 'MethodologyStep';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
};

const CALShowcase = () => {
  const methodologySteps = [
    {
      step: "1. DECONSTRUCT",
      description: "Break down complex requirements into manageable components",
      icon: "🔍"
    },
    {
      step: "2. DIAGNOSE", 
      description: "Identify optimization opportunities and potential issues",
      icon: "🔬"
    },
    {
      step: "3. DEVELOP",
      description: "Create optimized prompts using advanced AI techniques",
      icon: "⚡"
    },
    {
      step: "4. DELIVER",
      description: "Deploy high-performance prompts with measurable results",
      icon: "🚀"
    }
  ];

  return (
    <section id="cal-showcase" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            CAL™ Technology
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Cognitive Architecture Layering - The revolutionary 4-D methodology that transforms ordinary prompts into extraordinary results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: 4-D Methodology */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
          >
            <div className="glass-card notched-card p-8">
              <h3 className="text-3xl font-bold mb-8 gradient-text">The 4-D Methodology</h3>
              <div className="space-y-6">
                {methodologySteps.map((item, index) => (
                  <MethodologyStep key={index} {...item} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Performance Stats */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={2}
          >
            <div className="glass-card notched-card p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Performance Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Success Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 font-bold">95%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Efficiency Boost</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[87%] h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                    </div>
                    <span className="text-purple-400 font-bold">87%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Time Saved</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-yellow-400 font-bold">92%</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="glass-card notched-card p-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              custom={3}
            >
              <div className="text-4xl font-bold gradient-text mb-2">10,000+</div>
              <div className="text-gray-300 mb-4">Prompts Optimized</div>
              <Link href="/tools">
                <button className="glass-button px-6 py-3 rounded-lg font-semibold text-white hover:text-blue-400 transition-all duration-300">
                  Try CAL™ Demo
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          custom={4}
        >
          <div className="glass-card notched-card p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 gradient-text">
              Ready to Transform Your AI Prompts?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of entrepreneurs who've unlocked the power of CAL™ Technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <button className="glass-button px-8 py-4 rounded-lg font-semibold text-lg text-white hover:text-blue-400 transition-all duration-300">
                  Get Started Free
                </button>
              </Link>
              <Link href="/features">
                <button className="glass-button px-8 py-4 rounded-lg font-semibold text-lg text-white hover:text-purple-400 transition-all duration-300">
                  View Documentation
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CALShowcase; 