"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Target, 
  Crown,
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Globe,
  Code,
  Settings,
  Eye,
  Shield,
  Rocket,
  Brain,
  Users,
  Award,
  AlertTriangle,
  Lightbulb,
  Layers,
  Type,
  Layout,
  Gift,
  Diamond,
  Trophy,
  Copy,
  Share2
} from 'lucide-react';

export default function PromptPacks() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPack, setSelectedPack] = useState('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const promptPacks = [
    {
      id: 'basic',
      name: 'BASIC PACKAGE V1',
      subtitle: 'Essential AI Collection',
      price: '$99',
      description: 'Core prompt library with essential AI tools for beginners and professionals',
      features: [
        '20 essential prompts',
        'Basic AI workflows',
        'User onboarding flow',
        'Tutorial and documentation',
        'Community features',
        'Feedback and rating system'
      ],
      stats: { prompts: '20', users: '50K+', rating: '4.8' },
      color: 'from-blue-500 to-cyan-500',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 'bonus',
      name: 'BONUS PROMPT PACK V1',
      subtitle: 'Digital Product Creation',
      price: '$199',
      description: 'Premium prompts for digital product creation and marketing automation',
      features: [
        '20 premium prompts',
        'Interactive prompt testing',
        'Category organization',
        'Search and filter functionality',
        'Export and sharing features',
        'Advanced analytics'
      ],
      stats: { prompts: '20', users: '25K+', rating: '4.9' },
      color: 'from-purple-500 to-pink-500',
      icon: <Gift className="w-8 h-8" />
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE PACKAGE V1',
      subtitle: 'Enterprise AI Suite',
      price: '$499',
      description: 'Advanced enterprise features with team collaboration and custom solutions',
      features: [
        'Advanced prompt optimization',
        'Team collaboration tools',
        'Custom prompt creation',
        'Analytics and reporting',
        'White-label options',
        'Dedicated support'
      ],
      stats: { prompts: '40', users: '10K+', rating: '5.0' },
      color: 'from-green-500 to-emerald-500',
      icon: <Diamond className="w-8 h-8" />
    },
    {
      id: 'ultimate',
      name: 'ULTIMATE PLATINUM PACKAGE V1',
      subtitle: 'Complete AI Mastery',
      price: '$999',
      description: 'The complete AI mastery collection with 120+ enterprise-grade prompts',
      features: [
        '120+ enterprise prompts',
        'Advanced customization tools',
        'Priority support system',
        'Exclusive content access',
        'Advanced analytics',
        'White-label solutions'
      ],
      stats: { prompts: '120+', users: '5K+', rating: '5.0' },
      color: 'from-yellow-500 to-orange-500',
      icon: <Crown className="w-8 h-8" />
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "CAL™ Technology",
      description: "Cognitive Architecture Layering for unprecedented prompt optimization"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Interactive Testing",
      description: "Test prompts in real-time with instant feedback and optimization"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Category Organization",
      description: "Organized prompts by industry, use case, and complexity level"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Export & Share",
      description: "Export prompts in multiple formats and share with your team"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Custom Creation",
      description: "Create and customize prompts for your specific needs"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC2 compliant security with role-based access control"
    }
  ];

  const stats = [
    { label: "Total Prompts", value: "200+", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Active Users", value: "90K+", icon: <Users className="w-5 h-5" /> },
    { label: "Success Rate", value: "99.2%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Average Rating", value: "4.9/5", icon: <Star className="w-5 h-5" /> }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/novus/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: `Generate a professional ${selectedPack} prompt pack for AI optimization`,
          style: 'comprehensive',
          format: 'enhanced'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt pack');
      }

      const data = await response.json();
      
      // Generate realistic prompt pack based on selection
      const promptPacks = {
        basic: data.optimizedPrompt || 'Professional AI prompt for basic tasks with clear instructions and context',
        bonus: data.optimizedPrompt || 'Advanced AI prompt pack with bonus techniques for enhanced performance',
        enterprise: data.optimizedPrompt || 'Enterprise-grade AI prompt suite with comprehensive workflows and optimization',
        ultimate: data.optimizedPrompt || 'Ultimate AI prompt collection with cutting-edge techniques and advanced strategies'
      };

      setGeneratedPrompt(promptPacks[selectedPack as keyof typeof promptPacks] || data.optimizedPrompt);
    } catch (error) {
      console.error('Error generating prompt pack:', error);
      setGeneratedPrompt('Error generating prompt pack. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-orange-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Complete AI Mastery Collection
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Prompt Packs
              <span className="block bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                AI Mastery Suite
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master AI with our comprehensive prompt collections. From basic essentials to enterprise-grade solutions, unlock the full potential of artificial intelligence.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Explore Prompt Packs
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Demo
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Powered by CAL™ Technology
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Advanced prompt optimization with interactive testing and enterprise-grade features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prompt Packs Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Choose Your Prompt Pack
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              From essential tools to complete AI mastery, find the perfect prompt collection for your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {promptPacks.map((pack, index) => (
              <motion.div
                key={pack.id}
                className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer ${
                  selectedPack === pack.id ? 'border-yellow-500/50 bg-yellow-500/5' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedPack(pack.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`p-3 bg-gradient-to-r ${pack.color} rounded-lg text-white mr-4`}>
                      {pack.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{pack.name}</h3>
                      <p className="text-zinc-400">{pack.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{pack.price}</div>
                    <div className="text-sm text-zinc-400">One-time</div>
                  </div>
                </div>

                <p className="text-zinc-300 mb-6">{pack.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{pack.stats.prompts}</div>
                    <div className="text-sm text-zinc-400">Prompts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{pack.stats.rating}</div>
                    <div className="text-sm text-zinc-400">Rating</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pack.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center text-zinc-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300">
                  Get {pack.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Try Prompt Generation
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Experience the power of our prompt packs with interactive generation.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Prompt Generator</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={selectedPack}
                    onChange={(e) => setSelectedPack(e.target.value)}
                    className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  >
                    {promptPacks.map((pack) => (
                      <option key={pack.id} value={pack.id}>
                        {pack.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Prompt
                      </>
                    )}
                  </button>
                </div>
              </div>

              {generatedPrompt && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Generated Prompt</h4>
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4">
                      <p className="text-zinc-300 whitespace-pre-wrap">{generatedPrompt}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 flex items-center">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </button>
                    <button className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300 flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Prompt
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Master AI?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 90,000+ users who have transformed their AI capabilities with our prompt packs.
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Rocket className="w-5 h-5" />
            Start Mastering AI Today
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
} 