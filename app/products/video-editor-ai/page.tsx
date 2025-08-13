"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Scissors, 
  Film, 
  Zap, 
  TrendingUp, 
  Users,
  Video,
  Edit3,
  Palette,
  Music,
  Download,
  Share2,
  Eye,
  Clock,
  Sparkles
} from 'lucide-react';

export default function VideoEditorAI() {
  const [selectedTemplate, setSelectedTemplate] = useState('social');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedVideo, setProcessedVideo] = useState('');

  const templates = [
    { id: 'social', name: 'Social Media', icon: Share2 },
    { id: 'youtube', name: 'YouTube', icon: Video },
    { id: 'tiktok', name: 'TikTok', icon: TrendingUp },
    { id: 'instagram', icon: Eye },
    { id: 'facebook', icon: Users },
    { id: 'twitter', icon: Share2 }
  ];

  const features = [
    {
      icon: Edit3,
      title: "AI Video Editing",
      description: "Automated editing with intelligent scene detection and transitions"
    },
    {
      icon: Palette,
      title: "Visual Effects",
      description: "Advanced filters, overlays, and motion graphics"
    },
    {
      icon: Music,
      title: "Audio Enhancement",
      description: "Background music, voice enhancement, and sound effects"
    },
    {
      icon: Sparkles,
      title: "Auto Captions",
      description: "AI-generated captions with multiple language support"
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Multiple formats and quality settings for all platforms"
    },
    {
      icon: Clock,
      title: "Quick Rendering",
      description: "Fast processing with cloud-based rendering"
    }
  ];

  const pricingPlans = [
    {
      name: "Video Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 10 videos per month",
        "Basic AI editing tools",
        "720p export quality",
        "Standard templates",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Video Professional",
      price: "$79",
      period: "/month",
      features: [
        "Up to 50 videos per month",
        "Advanced AI editing",
        "4K export quality",
        "Premium templates",
        "Priority support",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Video Enterprise",
      price: "$199",
      period: "/month",
      features: [
        "Unlimited videos",
        "Enterprise AI features",
        "8K export quality",
        "Custom templates",
        "Dedicated support",
        "API access",
        "White-label options"
      ],
      popular: false
    }
  ];

  const handleVideoProcess = async () => {
    setIsProcessing(true);
    
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setProcessedVideo('Please log in to process videos.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/video/edit-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          title: 'My Video Project',
          duration: 120,
          style: 'professional',
          content_type: 'educational',
          target_audience: 'general',
          resolution: '4K',
          format: 'mp4'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.code === 'SUBSCRIPTION_REQUIRED') {
          setProcessedVideo('🔒 Video Editor AI subscription required. Please upgrade to access video processing.');
        } else if (data.error?.code === 'USAGE_LIMIT_EXCEEDED') {
          setProcessedVideo('📊 Monthly video processing limit reached. Please upgrade your plan for more videos.');
        } else {
          setProcessedVideo('❌ Error processing video. Please try again.');
        }
        return;
      }

      if (data.success && data.data) {
        setProcessedVideo(data.data.editPlan || 'Video processing completed successfully!');
      } else {
        setProcessedVideo('❌ Error processing video. Please try again.');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessedVideo('Error processing video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
            >
              <Video className="w-4 h-4 mr-2" />
              Powered by CAL™ Technology
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Video Editor
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> AI</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your content with AI-powered video editing. Create professional videos in minutes, 
              not hours. From social media clips to cinematic masterpieces.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Editing Free
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Play, value: "10M+", label: "Videos Edited" },
              { icon: Users, value: "500K+", label: "Active Users" },
              { icon: TrendingUp, value: "95%", label: "Time Saved" },
              { icon: Zap, value: "24/7", label: "AI Processing" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Professional Video Editing Made Simple
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI understands your content and creates stunning videos automatically. 
              Focus on your message, we'll handle the editing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Try Our AI Video Editor
            </h2>
            <p className="text-xl text-gray-400">
              Experience the power of AI-driven video editing
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Template Selection */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Choose Template</h3>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          selectedTemplate === template.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white mb-2" />
                        <div className="text-white font-medium">{template.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Video Processing */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">AI Processing</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Scene Detection</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Auto Editing</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Effects & Transitions</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <button
                    onClick={handleVideoProcess}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Process Video'}
                  </button>
                </div>
              </div>
            </div>

            {processedVideo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-center text-green-400 mb-2">
                  <Play className="w-5 h-5 mr-2" />
                  Video Processing Complete!
                </div>
                <p className="text-gray-300">
                  Your AI-edited video is ready for download. The video has been optimized for {selectedTemplate} platform.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Start free and scale as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Videos?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators who trust our AI to edit their videos. 
              Start creating professional content in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 