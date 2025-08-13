"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  Globe,
  Hash,
  MessageSquare,
  FileText,
  Video,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  BarChart3,
  Flame,
  Users,
  Eye,
  Heart,
  Share2,
  Clock,
  AlertCircle,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface ContentPiece {
  id: string;
  type: string;
  platform: string;
  content: string;
  hashtags: string[];
  viralScore: number;
  engagementScore: number;
  bestTime: string;
}

export default function ContentSpawnerDemo() {
  const [topic, setTopic] = useState('AI and productivity tools');
  const [contentType, setContentType] = useState('social');
  const [platform, setPlatform] = useState('all');
  const [tone, setTone] = useState('professional');
  const [quantity, setQuantity] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentPiece[]>([]);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const processingStepsData = [
    { text: '🚀 Initializing Viral Content Engine...', duration: 800 },
    { text: '📊 Analyzing trending topics and hashtags...', duration: 1200 },
    { text: '🧠 Running AI content generation models...', duration: 1000 },
    { text: '🎯 Optimizing for maximum engagement...', duration: 900 },
    { text: '📈 Calculating viral probability scores...', duration: 700 },
    { text: '⚡ Enhancing with psychological triggers...', duration: 800 },
    { text: '✨ Applying platform-specific optimizations...', duration: 600 },
    { text: '🏆 Finalizing viral content package...', duration: 500 }
  ];

  const contentTypes = [
    { id: 'social', name: 'Social Media', icon: MessageSquare },
    { id: 'blog', name: 'Blog Posts', icon: FileText },
    { id: 'video', name: 'Video Scripts', icon: Video },
    { id: 'email', name: 'Email Campaigns', icon: Mail }
  ];

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: Globe },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'youtube', name: 'YouTube', icon: Youtube }
  ];

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual' },
    { id: 'humorous', name: 'Humorous' },
    { id: 'inspirational', name: 'Inspirational' },
    { id: 'educational', name: 'Educational' }
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    setProcessingSteps([]);
    setCurrentStep(0);
    setGeneratedContent([]);
    setShowAnalytics(false);

    // Simulate AI processing
    for (let i = 0; i < processingStepsData.length; i++) {
      setCurrentStep(i);
      setProcessingSteps(prev => [...prev, processingStepsData[i].text]);
      await new Promise(resolve => setTimeout(resolve, processingStepsData[i].duration));
    }

    // Generate sample content
    const sampleContent: ContentPiece[] = [];
    const platformList = platform === 'all' 
      ? ['instagram', 'twitter', 'linkedin'] 
      : [platform];

    for (let i = 0; i < quantity; i++) {
      const selectedPlatform = platformList[i % platformList.length];
      
      const contentTemplates = {
        instagram: [
          `🚀 ${topic} is revolutionizing how we work!\n\n✨ Here's what you need to know:\n• Increased productivity by 47%\n• Saved 2+ hours daily\n• Simplified complex workflows\n\nReady to transform your routine? 💪`,
          `The future of ${topic} is HERE! 🌟\n\nStop wasting time on outdated methods.\nStart embracing smart solutions.\n\n3 game-changing benefits:\n1️⃣ Instant results\n2️⃣ Zero learning curve\n3️⃣ Massive ROI\n\nWhich one excites you most? 👇`
        ],
        twitter: [
          `🔥 Hot take: ${topic} isn't just a trend—it's the future of work.\n\nHere's why smart professionals are making the switch:\n\n🎯 10x faster results\n📈 Proven ROI\n🚀 Competitive edge\n\nRT if you're ready to level up!`,
          `Just discovered how ${topic} can save you 15 hours per week.\n\nThe secret? It's all about working smarter, not harder.\n\nThread below on my top 5 productivity hacks 🧵👇`
        ],
        linkedin: [
          `🎯 How ${topic} is Reshaping Professional Excellence\n\nAfter implementing these tools, our team saw:\n• 67% increase in productivity\n• 45% reduction in operational costs\n• 89% employee satisfaction rate\n\nThe key? Strategic integration and continuous optimization.\n\nWhat's your experience with ${topic}? Share your insights below.`,
          `The intersection of ${topic} is creating unprecedented opportunities.\n\nHere's what forward-thinking leaders need to know:\n\n1. Early adoption = competitive advantage\n2. ROI typically seen within 30 days\n3. Scalability is built-in from day one\n\nAre you prepared for this shift?`
        ]
      };

      const templates = contentTemplates[selectedPlatform] || contentTemplates.instagram;
      const content = templates[i % templates.length];
      
      const hashtags = selectedPlatform === 'instagram' 
        ? ['#productivity', '#AI', '#innovation', '#futureofwork', '#techtrends']
        : selectedPlatform === 'twitter'
        ? ['#ProductivityHack', '#AI', '#TechTrends', '#Innovation']
        : ['#Leadership', '#Innovation', '#DigitalTransformation', '#FutureOfWork'];

      sampleContent.push({
        id: `content-${i + 1}`,
        type: contentType,
        platform: selectedPlatform,
        content: content,
        hashtags: hashtags,
        viralScore: Math.floor(Math.random() * 20) + 80,
        engagementScore: Math.floor(Math.random() * 15) + 85,
        bestTime: selectedPlatform === 'instagram' ? '6:00 PM - 9:00 PM' :
                  selectedPlatform === 'twitter' ? '9:00 AM - 10:00 AM' :
                  '7:00 AM - 8:00 AM'
      });
    }

    setGeneratedContent(sampleContent);
    setShowAnalytics(true);
    setIsGenerating(false);
  };

  const getPlatformIcon = (platformId: string) => {
    switch (platformId) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platformId: string) => {
    switch (platformId) {
      case 'instagram': return 'from-pink-500 to-purple-500';
      case 'twitter': return 'from-blue-400 to-blue-600';
      case 'linkedin': return 'from-blue-600 to-blue-800';
      case 'youtube': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/products/content-spawner" className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Content Spawner</span>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Content Spawner Demo
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Viral Content Generator - Create engaging content optimized for maximum reach and engagement across all platforms
          </p>
          
          {/* Live Demo Badge */}
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-orange-400 text-sm font-medium">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span>Live Working Demo</span>
          </div>
        </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Content Generation Panel */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Flame className="w-6 h-6 mr-2 text-orange-500" />
                  Viral Content Generator
                </h2>

                {/* Topic Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Topic or Niche
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Enter your topic or niche..."
                  />
                </div>

                {/* Content Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {contentTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <motion.button
                          key={type.id}
                          onClick={() => setContentType(type.id)}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            contentType === type.id
                              ? 'border-orange-500/50 bg-orange-500/10'
                              : 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-600'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-2 ${
                            contentType === type.id ? 'text-orange-400' : 'text-zinc-400'
                          }`} />
                          <span className={`text-xs ${
                            contentType === type.id ? 'text-orange-400' : 'text-zinc-300'
                          }`}>
                            {type.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Target Platform
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {platforms.map((plat) => {
                      const Icon = plat.icon;
                      return (
                        <motion.button
                          key={plat.id}
                          onClick={() => setPlatform(plat.id)}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            platform === plat.id
                              ? 'border-orange-500/50 bg-orange-500/10'
                              : 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-600'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1 ${
                            platform === plat.id ? 'text-orange-400' : 'text-zinc-400'
                          }`} />
                          <span className={`text-xs ${
                            platform === plat.id ? 'text-orange-400' : 'text-zinc-300'
                          }`}>
                            {plat.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Tone & Style
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((t) => (
                      <motion.button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                          tone === t.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity Slider */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Number of Content Pieces: {quantity}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${quantity * 10}%, #27272a ${quantity * 10}%, #27272a 100%)`
                    }}
                  />
                </div>

                {/* Generate Button */}
                <div className="text-center">
                  <motion.button
                    onClick={generateContent}
                    disabled={isGenerating || !topic.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{isGenerating ? 'Generating...' : 'Generate Viral Content'}</span>
                  </motion.button>
                </div>

                {/* Processing Animation */}
                <AnimatePresence>
                  {isGenerating && processingSteps.length > 0 && (
                    <motion.div
                      className="mt-8 bg-zinc-800/40 rounded-xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Flame className="w-8 h-8 text-orange-500" />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        {processingSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-zinc-400 flex items-center"
                          >
                            {index === currentStep && (
                              <motion.div
                                className="w-2 h-2 bg-orange-500 rounded-full mr-2"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                              />
                            )}
                            {index < currentStep && <CheckCircle className="w-4 h-4 text-green-400 mr-2" />}
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generated Content */}
                <AnimatePresence>
                  {generatedContent.length > 0 && (
                    <motion.div
                      className="mt-8 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                        Generated Viral Content
                      </h3>
                      
                      {generatedContent.map((content, index) => (
                        <motion.div
                          key={content.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300"
                        >
                          {/* Content Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 bg-gradient-to-br ${getPlatformColor(content.platform)} rounded-lg`}>
                                {getPlatformIcon(content.platform)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-white capitalize">{content.platform} Post</h4>
                                <p className="text-xs text-zinc-500">Best time: {content.bestTime}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-400">{content.viralScore}%</div>
                                <div className="text-xs text-zinc-500">Viral Score</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-400">{content.engagementScore}%</div>
                                <div className="text-xs text-zinc-500">Engagement</div>
                              </div>
                            </div>
                          </div>

                          {/* Content Body */}
                          <div className="mb-4">
                            <p className="text-zinc-300 whitespace-pre-wrap">{content.content}</p>
                          </div>

                          {/* Hashtags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {content.hashtags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-zinc-700/50 text-zinc-300 rounded-full text-sm flex items-center"
                              >
                                <Hash className="w-3 h-3 mr-1" />
                                {tag.replace('#', '')}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-zinc-500">
                              <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs">Like</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs">Comment</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span className="text-xs">Share</span>
                              </button>
                            </div>
                            <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors">
                              Copy Content
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-6">
              {/* Performance Metrics */}
              <motion.div 
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 text-orange-500 mr-2" />
                  Performance Prediction
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Viral Potential</span>
                      <span className="text-white font-semibold">87%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '87%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Engagement Rate</span>
                      <span className="text-white font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-zinc-400">Shareability</span>
                      <span className="text-white font-semibold">78%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Analytics */}
              {showAnalytics && (
                <motion.div 
                  className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Eye className="w-5 h-5 text-purple-400 mr-2" />
                    Content Analytics
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-zinc-800/40 rounded-lg">
                      <span className="text-sm text-zinc-300">Total Reach</span>
                      <span className="text-white font-semibold">~125K</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/40 rounded-lg">
                      <span className="text-sm text-zinc-300">Avg. Engagement</span>
                      <span className="text-white font-semibold">8.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/40 rounded-lg">
                      <span className="text-sm text-zinc-300">Share Rate</span>
                      <span className="text-white font-semibold">4.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-800/40 rounded-lg">
                      <span className="text-sm text-zinc-300">Click Rate</span>
                      <span className="text-white font-semibold">12.7%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Insights */}
              <motion.div 
                className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center mb-3">
                  <Brain className="w-5 h-5 text-orange-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-300">
                      Your content has high viral potential due to trending topic relevance
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Target className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-300">
                      Optimal posting time: 6-9 PM local time for maximum engagement
                    </p>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-300">
                      Add video content to increase engagement by 120%
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Optimization Tips */}
              <motion.div 
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Rocket className="w-5 h-5 text-blue-400 mr-2" />
                  Optimization Tips
                </h3>
                
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">
                      Use power words to increase click-through rates
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">
                      Include a clear call-to-action in every post
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">
                      Test different content formats regularly
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">
                      Engage with comments within first hour
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Features Preview */}
          <motion.div 
            className="mt-12 bg-zinc-900/30 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Unlock Full Content Spawner Features
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Audience Analysis</h4>
                <p className="text-sm text-zinc-400">Deep insights into your target audience preferences</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Content Calendar</h4>
                <p className="text-sm text-zinc-400">Automated scheduling and posting across platforms</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Trend Monitoring</h4>
                <p className="text-sm text-zinc-400">Real-time trend detection and content adaptation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Bulk Generation</h4>
                <p className="text-sm text-zinc-400">Generate hundreds of pieces in minutes</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/products/content-spawner">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Unlock Full Version
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Ready to create viral content?</h2>
            <p className="text-zinc-400 mb-8">Get unlimited access to Content Spawner and 25+ other AI tools</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
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
    </div>
  );
}