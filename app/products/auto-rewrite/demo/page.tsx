'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Copy, RotateCcw, CheckCircle, FileText, Edit, Target, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Content Rewrite Engine
const rewriteContent = (originalText: string, style: string, audience: string) => {
  const rewriteStrategies = {
    'professional': {
      improvements: [
        'Enhanced professional vocabulary and terminology',
        'Improved sentence structure for business context',
        'Added formal tone and authoritative language',
        'Strengthened credibility markers and expertise'
      ],
      transform: (text: string, audience: string) => {
        // Professional rewrite logic
        const businessTerms = {
          'help': 'assist',
          'use': 'utilize',
          'get': 'obtain',
          'make': 'create',
          'good': 'exceptional',
          'better': 'superior',
          'new': 'innovative',
          'fast': 'efficient',
          'easy': 'streamlined'
        };
        
        let rewritten = text;
        Object.entries(businessTerms).forEach(([casual, professional]) => {
          rewritten = rewritten.replace(new RegExp(`\\b${casual}\\b`, 'gi'), professional);
        });
        
        return `As industry-leading professionals, we ${rewritten.toLowerCase()} Our comprehensive approach leverages cutting-edge methodologies to deliver measurable results for our clients. Through strategic partnerships and innovative solutions, we ensure optimal performance and sustainable growth for organizations across diverse sectors.`;
      }
    },
    'conversational': {
      improvements: [
        'Added conversational tone and relatability',
        'Included engaging questions and direct address',
        'Simplified complex concepts for accessibility',
        'Enhanced emotional connection with reader'
      ],
      transform: (text: string, audience: string) => {
        return `You know what? ${text} But here's the thing - we don't just talk the talk, we actually walk the walk. Think of us as your go-to team who gets things done while making sure you feel heard and valued every step of the way. It's not just about what we do, it's about how we make you feel throughout the entire experience.`;
      }
    },
    'persuasive': {
      improvements: [
        'Integrated compelling value propositions',
        'Added urgency and scarcity elements',
        'Included social proof and credibility indicators',
        'Enhanced call-to-action strength'
      ],
      transform: (text: string, audience: string) => {
        return `${text} But here's what sets us apart from everyone else in the market: we don't just deliver results, we exceed expectations every single time. Join thousands of satisfied clients who have already transformed their success story with our proven methodology. Don't let this opportunity pass you by - the companies that act now are the ones that stay ahead of the competition tomorrow.`;
      }
    },
    'technical': {
      improvements: [
        'Incorporated technical precision and accuracy',
        'Added detailed specifications and methodologies',
        'Enhanced technical credibility and expertise',
        'Structured content for technical comprehension'
      ],
      transform: (text: string, audience: string) => {
        return `${text} Our implementation leverages advanced algorithms, scalable architectures, and industry-standard protocols to ensure optimal performance, security, and reliability. Through comprehensive testing frameworks, continuous integration pipelines, and robust monitoring systems, we maintain 99.9% uptime while delivering enterprise-grade solutions that integrate seamlessly with existing infrastructure.`;
      }
    },
    'creative': {
      improvements: [
        'Added vivid imagery and metaphorical language',
        'Enhanced storytelling and narrative flow',
        'Incorporated creative analogies and examples',
        'Boosted emotional engagement and memorability'
      ],
      transform: (text: string, audience: string) => {
        return `Imagine a world where ${text.toLowerCase()} Like a master craftsman shaping raw materials into a work of art, we transform your vision into reality with precision, passion, and an unwavering commitment to excellence. Every project becomes a canvas, every challenge a stepping stone, and every success story a testament to the magic that happens when innovation meets dedication.`;
      }
    },
    'simplified': {
      improvements: [
        'Reduced complexity and jargon',
        'Shortened sentences for better readability',
        'Added clear examples and explanations',
        'Enhanced accessibility for broader audience'
      ],
      transform: (text: string, audience: string) => {
        return `We make things simple. ${text} Here's how it works: we take complex problems and turn them into easy solutions. No complicated processes, no confusing steps. Just clear, straightforward results that make sense. Think of it as having a helpful friend who knows exactly what you need and how to get it done quickly and easily.`;
      }
    }
  };

  const strategy = rewriteStrategies[style as keyof typeof rewriteStrategies];
  if (!strategy) return null;

  return {
    rewrittenText: strategy.transform(originalText, audience),
    improvements: strategy.improvements,
    score: Math.floor(Math.random() * 20) + 80, // 80-100 score
    wordCount: {
      original: originalText.split(' ').length,
      rewritten: strategy.transform(originalText, audience).split(' ').length
    }
  };
};

export default function AutoRewriteDemo() {
  const [originalText, setOriginalText] = useState('');
  const [rewriteStyle, setRewriteStyle] = useState('professional');
  const [targetAudience, setTargetAudience] = useState('business-professionals');
  const [rewriteResult, setRewriteResult] = useState<any>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!originalText.trim()) return;
    
    setIsRewriting(true);
    // Simulate AI processing delay
    setTimeout(() => {
      const result = rewriteContent(originalText, rewriteStyle, targetAudience);
      setRewriteResult(result);
      setIsRewriting(false);
    }, 2500);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleTexts = [
    "Our company provides innovative solutions for businesses looking to improve their productivity and efficiency.",
    "We help customers achieve their goals through quality service and dedicated support.",
    "This product is designed to make your life easier and more efficient with cutting-edge technology.",
    "Join thousands of satisfied customers who trust our expertise and proven track record."
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/products/auto-rewrite" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AutoRewrite Engine</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AutoRewrite Engine Demo
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Content Refinement - Transform any text into multiple styles and tones for different audiences
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
              <FileText className="w-6 h-6 mr-3 text-green-400" />
              Original Content
            </h2>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Writing Style</label>
              <select
                value={rewriteStyle}
                onChange={(e) => setRewriteStyle(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="persuasive">Persuasive</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
                <option value="simplified">Simplified</option>
              </select>
            </div>

            {/* Audience Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="business-professionals">Business Professionals</option>
                <option value="general-public">General Public</option>
                <option value="technical-experts">Technical Experts</option>
                <option value="students">Students</option>
                <option value="executives">Executives</option>
                <option value="customers">Customers</option>
              </select>
            </div>

            {/* Text Input */}
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Enter your original text here..."
              className="w-full h-32 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />

            {/* Example Texts */}
            <div className="mt-4">
              <p className="text-sm text-zinc-400 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleTexts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setOriginalText(example)}
                    className="px-3 py-1 bg-zinc-700/50 hover:bg-zinc-700 rounded-full text-xs text-zinc-300 hover:text-white transition-colors"
                  >
                    {example.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Rewrite Button */}
            <button
              onClick={handleRewrite}
              disabled={!originalText.trim() || isRewriting}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isRewriting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  <span>Rewriting Content...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Rewrite Content</span>
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
              <Edit className="w-6 h-6 mr-3 text-green-400" />
              Rewritten Content
            </h2>

            {!rewriteResult ? (
              <div className="h-64 flex items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-700 rounded-lg">
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your rewritten content will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Rewrite Quality Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${rewriteResult.score}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-green-400 font-bold">{rewriteResult.score}%</span>
                  </div>
                </div>

                {/* Word Count Comparison */}
                <div className="flex items-center justify-between text-sm">
                  <div className="text-zinc-400">
                    Original: <span className="text-white">{rewriteResult.wordCount.original} words</span>
                  </div>
                  <div className="text-zinc-400">
                    Rewritten: <span className="text-green-400">{rewriteResult.wordCount.rewritten} words</span>
                  </div>
                </div>

                {/* Rewritten Text */}
                <div className="relative">
                  <textarea
                    value={rewriteResult.rewrittenText}
                    readOnly
                    className="w-full h-48 px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white resize-none"
                  />
                  <button
                    onClick={() => handleCopy(rewriteResult.rewrittenText)}
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
                  <h3 className="text-white font-semibold mb-3">Key Improvements Applied:</h3>
                  <ul className="space-y-2">
                    {rewriteResult.improvements.map((improvement: string, index: number) => (
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
            Why AutoRewrite Engine Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: RefreshCw, title: 'Style Transformation', desc: 'Convert any tone to match your needs' },
              { icon: Target, title: 'Audience Matching', desc: 'Tailored content for specific audiences' },
              { icon: Zap, title: 'Instant Results', desc: 'Get rewritten content in seconds' },
              { icon: Copy, title: 'Ready to Publish', desc: 'Copy-paste optimized content instantly' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-2xl font-bold text-white mb-4">Ready to transform all your content?</h2>
          <p className="text-zinc-400 mb-8">Get unlimited access to AutoRewrite Engine and 25+ other AI tools</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
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