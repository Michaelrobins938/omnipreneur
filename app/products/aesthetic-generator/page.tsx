"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Image, 
  Sparkles, 
  Download, 
  Share2,
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Globe,
  Code,
  Settings,
  Eye,
  Zap,
  Shield,
  Rocket,
  Brush,
  Users,
  Award,
  AlertTriangle,
  Lightbulb,
  Layers,
  Type,
  Layout,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';

export default function AestheticGenerator() {
  const [activeTab, setActiveTab] = useState('overview');
  const [designPrompt, setDesignPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<any>(null);
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "AI Design Generation",
      description: "Create stunning visuals with Gemini API integration and advanced design algorithms"
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Template Library",
      description: "Extensive collection of professional templates for all design needs"
    },
    {
      icon: <Brush className="w-6 h-6" />,
      title: "Brand Kit Management",
      description: "Maintain brand consistency with centralized color palettes and typography"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Style Transfer",
      description: "Apply artistic styles and filters to transform your designs instantly"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Share",
      description: "Export in multiple formats and share directly to social media platforms"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Collaboration Tools",
      description: "Real-time collaboration with team members and client feedback"
    }
  ];

  const stats = [
    { label: "Designs Generated", value: "500K+", icon: <Image className="w-5 h-5" /> },
    { label: "Templates Available", value: "10K+", icon: <Layout className="w-5 h-5" /> },
    { label: "Active Users", value: "100K+", icon: <Users className="w-5 h-5" /> },
    { label: "Export Formats", value: "15+", icon: <Download className="w-5 h-5" /> }
  ];

  const templates = [
    { name: "Social Media Post", category: "Social", preview: "🎨", color: "from-pink-500 to-purple-500" },
    { name: "Business Card", category: "Business", preview: "💼", color: "from-blue-500 to-cyan-500" },
    { name: "Logo Design", category: "Branding", preview: "✨", color: "from-green-500 to-emerald-500" },
    { name: "Flyer Template", category: "Marketing", preview: "📄", color: "from-orange-500 to-red-500" },
    { name: "Instagram Story", category: "Social", preview: "📱", color: "from-purple-500 to-pink-500" },
    { name: "Presentation Slide", category: "Business", preview: "📊", color: "from-indigo-500 to-blue-500" }
  ];

  const handleGenerate = async () => {
    if (!designPrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Use dedicated design generation API
      const response = await fetch('/api/design/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: designPrompt,
          style: 'modern',
          format: 'social-post',
          brandColors: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate design');
      }

      const data = await response.json();
      const design = data.data?.design;
      
      // Create a structured design output using AI service response
      setGeneratedDesign({
        id: design?.designId || Date.now(),
        prompt: designPrompt,
        imageUrl: `https://picsum.photos/600/400?random=${Date.now()}`,
        style: design?.style || "AI-Generated Design",
        colors: design?.colors || ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"],
        fonts: design?.typography ? [design.typography.primary, design.typography.secondary] : ["Inter", "Poppins"],
        elements: ["AI-Generated Layout", "Color Harmony", "Typography System", "Visual Hierarchy"],
        exportFormats: design?.exportFormats || ["PNG", "SVG", "PDF"],
        description: design?.description || "AI-generated design concept based on your prompt.",
        variations: design?.variations || ["Original"]
      });
    } catch (error) {
      console.error('Error generating design:', error);
      setGeneratedDesign({
        id: Date.now(),
        prompt: designPrompt,
        imageUrl: `https://picsum.photos/600/400?random=${Date.now()}`,
        style: "Error - Please try again",
        colors: ["#ef4444"],
        fonts: ["Inter"],
        elements: ["Error occurred"],
        exportFormats: ["PNG"],
        description: "Failed to generate design. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation Breadcrumb */}
      <motion.div 
        className="fixed top-20 left-6 z-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.a
          href="/products"
          className="flex items-center space-x-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-cyan-500 transition-all duration-300 group"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:text-cyan-400 transition-colors duration-300" />
          <span className="text-sm font-medium">Back to Products</span>
        </motion.a>
      </motion.div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-purple-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gemini AI Powered
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Aesthetic Generator
              <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Canva Layout Designer
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform your ideas into stunning visuals with AI-powered design generation, professional templates, and brand-consistent layouts that captivate your audience.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Try Aesthetic Generator
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Templates
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
              Powered by Gemini AI
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Advanced AI design generation with professional templates and brand management tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 mr-4">
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

      {/* Template Gallery */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Professional Templates
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Choose from thousands of professionally designed templates for every use case.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-full h-32 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-4 text-4xl group-hover:scale-110 transition-transform duration-300`}>
                  {template.preview}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-zinc-400 text-sm">{template.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Design Generator */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Try Aesthetic Generator
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Experience the power of Gemini AI with our interactive design generation tool.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Design Generator */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">AI Design Generator</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={designPrompt}
                    onChange={(e) => setDesignPrompt(e.target.value)}
                    placeholder="Describe your design (e.g., 'Modern minimalist business card with blue gradient')"
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:border-pink-500 focus:outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !designPrompt.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Design
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Design */}
              {generatedDesign && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Design Preview */}
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Generated Design</h4>
                      <div className="aspect-video bg-zinc-900/50 rounded-lg flex items-center justify-center mb-4">
                        <img 
                          src={generatedDesign.imageUrl} 
                          alt="Generated Design"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2">
                        {generatedDesign.exportFormats.map((format: string, index: number) => (
                          <button
                            key={index}
                            className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-300 text-sm hover:border-pink-500 transition-colors"
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Design Details */}
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Design Details</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-zinc-400 text-sm mb-1">Style</p>
                          <p className="text-white font-medium">{generatedDesign.style}</p>
                        </div>

                        <div>
                          <p className="text-zinc-400 text-sm mb-1">Colors</p>
                          <div className="flex gap-2">
                            {generatedDesign.colors.map((color: string, index: number) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border border-zinc-600"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-zinc-400 text-sm mb-1">Fonts</p>
                          <div className="flex gap-2">
                            {generatedDesign.fonts.map((font: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-zinc-900 rounded text-xs text-zinc-300">
                                {font}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-zinc-400 text-sm mb-1">Elements</p>
                          <div className="space-y-1">
                            {generatedDesign.elements.map((element: string, index: number) => (
                              <p key={index} className="text-zinc-300 text-sm">• {element}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download Design
                    </button>
                    <button className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300 flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Design
                    </button>
                    <button className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300 flex items-center">
                      <Brush className="w-4 h-4 mr-2" />
                      Edit Design
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Choose Your Design Plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Start creating stunning designs with our flexible pricing plans designed for creators and businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $19<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  50 designs/month
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic templates
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Email support
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Get Started
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border border-pink-500/50 rounded-xl p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $49<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Unlimited designs
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Premium templates
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Brand kit management
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
                Get Started
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $199<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  API access
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  White-label options
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Dedicated support
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-900/20 to-purple-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Create Stunning Designs?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 100,000+ creators who have transformed their visual content with Aesthetic Generator.
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Rocket className="w-5 h-5" />
            Start Designing Today
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Left Side - Copyright and Origin */}
            <div className="flex items-center space-x-4 text-zinc-400 text-sm">
              <span>© 2024 Omnipreneur. All rights reserved.</span>
              <span>Made with ❤️ in San Francisco</span>
            </div>

            {/* Middle - Legal Links */}
            <div className="flex flex-wrap justify-center space-x-6 text-zinc-400 text-sm">
              <a href="/legal/privacy" className="hover:text-white transition-colors underline">Privacy Policy</a>
              <a href="/legal/terms" className="hover:text-white transition-colors underline">Terms of Service</a>
              <a href="/support" className="hover:text-white transition-colors underline">Support</a>
              <a href="/contact" className="hover:text-white transition-colors underline">Contact</a>
            </div>

            {/* Right Side - Social Media Icons */}
            <div className="flex items-center space-x-3">
              <a href="#" className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
} 