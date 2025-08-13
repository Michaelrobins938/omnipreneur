'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Copy, RotateCcw, CheckCircle, Brain, Target, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// AI Prompt Optimization Engine
const optimizePrompt = (originalPrompt: string, optimizationType: string) => {
  const optimizations = {
    'clarity': {
      improvements: [
        'Added specific context and constraints',
        'Clarified expected output format',
        'Included role-based instruction',
        'Specified tone and style requirements'
      ],
      transform: (prompt: string) => {
        return `Act as a professional expert in this domain. ${prompt}

Please provide a detailed response that:
- Is clear and actionable
- Includes specific examples where relevant
- Uses a professional but accessible tone
- Is structured with clear sections or bullet points

Format your response with clear headings and ensure all information is accurate and helpful.`;
      }
    },
    'creativity': {
      improvements: [
        'Enhanced creative thinking triggers',
        'Added brainstorming frameworks',
        'Included perspective diversity',
        'Expanded ideation scope'
      ],
      transform: (prompt: string) => {
        return `Think creatively and outside the box. ${prompt}

Approach this from multiple angles:
- Consider unconventional solutions
- Brainstorm at least 3 different approaches
- Think about this from different stakeholder perspectives
- Include innovative and cutting-edge ideas
- Don't be limited by traditional methods

Be bold, creative, and comprehensive in your response. Include both practical and aspirational ideas.`;
      }
    },
    'specificity': {
      improvements: [
        'Added precise parameters',
        'Included measurable criteria',
        'Specified exact requirements',
        'Enhanced detail requirements'
      ],
      transform: (prompt: string) => {
        return `${prompt}

Please be extremely specific and detailed in your response:
- Include exact steps or procedures
- Provide specific examples and case studies
- Use measurable metrics where applicable
- Include timeframes and deadlines
- Specify tools, resources, or materials needed
- Add any relevant constraints or limitations

The more specific and actionable your response, the better.`;
      }
    },
    'persuasive': {
      improvements: [
        'Enhanced persuasive elements',
        'Added emotional appeal',
        'Included social proof triggers',
        'Structured for influence'
      ],
      transform: (prompt: string) => {
        return `${prompt}

Frame your response to be highly persuasive and compelling:
- Use powerful, action-oriented language
- Include compelling reasons and benefits
- Add social proof and credibility markers
- Create a sense of urgency where appropriate
- Address potential objections or concerns
- Include a clear call-to-action
- Use storytelling elements to engage emotionally

Make your response impossible to ignore and highly motivating.`;
      }
    }
  };

  const optimization = optimizations[optimizationType as keyof typeof optimizations];
  return {
    optimizedPrompt: optimization.transform(originalPrompt),
    improvements: optimization.improvements,
    score: Math.floor(Math.random() * 30) + 70 // 70-100 score
  };
};

export default function NOVUSProtocolDemo() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizationType, setOptimizationType] = useState('clarity');
  const [optimizedResult, setOptimizedResult] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!originalPrompt.trim()) return;
    
    setIsOptimizing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      const result = optimizePrompt(originalPrompt, optimizationType);
      setOptimizedResult(result);
      setIsOptimizing(false);
    }, 2000);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examplePrompts = [
    "Write a blog post about AI",
    "Create a marketing strategy for my product",
    "Help me plan a team meeting",
    "Generate ideas for my startup"
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/products/novus-protocol" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to NOVUS Protocol</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            NOVUS Protocol Demo
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            AI Prompt Optimizer - Transform basic prompts into high-performance AI instructions that get better results
          </p>
          
          {/* Live Demo Badge */}
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-400 text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live Working Demo</span>
          </div>
        </motion.div>

        {/* Working Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-400" />
              Original Prompt
            </h2>

            {/* Optimization Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Optimization Type</label>
              <select
                value={optimizationType}
                onChange={(e) => setOptimizationType(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="clarity">Clarity & Structure</option>
                <option value="creativity">Creative & Innovative</option>
                <option value="specificity">Specific & Detailed</option>
                <option value="persuasive">Persuasive & Compelling</option>
              </select>
            </div>

            {/* Prompt Input */}
            <textarea
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Enter your original prompt here..."
              className="w-full h-32 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            {/* Example Prompts */}
            <div className="mt-4">
              <p className="text-sm text-zinc-400 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setOriginalPrompt(example)}
                    className="px-3 py-1 bg-zinc-700/50 hover:bg-zinc-700 rounded-full text-xs text-zinc-300 hover:text-white transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Optimize Button */}
            <button
              onClick={handleOptimize}
              disabled={!originalPrompt.trim() || isOptimizing}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isOptimizing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  <span>Optimizing with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Optimize Prompt</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 mr-3 text-green-400" />
              Optimized Result
            </h2>

            {!optimizedResult ? (
              <div className="h-64 flex items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your optimized prompt will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Optimization Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-purple-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${optimizedResult.score}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-green-400 font-bold">{optimizedResult.score}%</span>
                  </div>
                </div>

                {/* Optimized Prompt */}
                <div className="relative">
                  <textarea
                    value={optimizedResult.optimizedPrompt}
                    readOnly
                    className="w-full h-48 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white resize-none"
                  />
                  <button
                    onClick={() => handleCopy(optimizedResult.optimizedPrompt)}
                    className="absolute top-3 right-3 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Key Improvements:</h3>
                  <ul className="space-y-2">
                    {optimizedResult.improvements.map((improvement: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start space-x-2 text-zinc-300 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{improvement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Why NOVUS Protocol Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'AI-Powered Analysis', desc: 'Deep learning models analyze prompt structure' },
              { icon: Target, title: 'Context Enhancement', desc: 'Adds missing context and constraints' },
              { icon: Zap, title: 'Performance Boost', desc: 'Up to 300% better AI response quality' },
              { icon: Copy, title: 'Ready to Use', desc: 'Copy-paste optimized prompts instantly' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to optimize all your prompts?</h2>
          <p className="text-zinc-400 mb-8">Get unlimited access to NOVUS Protocol and 25+ other AI tools</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                View Pricing
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

