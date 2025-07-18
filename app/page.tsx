"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  Package,
  Brain,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const products = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "NOVUS Protocol",
      subtitle: "AI Prompt Optimizer",
      description: "Revolutionary AI prompt engineering that transforms your ideas into optimized, high-converting content with unprecedented accuracy.",
      features: ["Advanced prompt engineering", "Real-time optimization", "Multi-language support", "Performance analytics", "Custom templates", "API integration"],
      stats: { accuracy: "99.2%", speed: "10x faster", users: "50K+" },
      price: "From $29/month",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AutoRewrite Engine",
      subtitle: "Content Refinement",
      description: "Intelligent content rewriting that maintains your voice while optimizing for engagement, SEO, and conversion rates.",
      features: ["Smart content rewriting", "SEO optimization", "Tone preservation", "Plagiarism detection", "Bulk processing", "Version control"],
      stats: { accuracy: "98.7%", speed: "5x faster", users: "75K+" },
      price: "From $49/month",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Bundle Builder",
      subtitle: "Product Packaging",
      description: "Create premium digital products and courses with AI-powered packaging, pricing optimization, and marketing automation.",
      features: ["AI-powered packaging", "Pricing optimization", "Marketing automation", "Sales funnel builder", "Analytics dashboard", "Customer segmentation"],
      stats: { accuracy: "97.5%", speed: "8x faster", users: "25K+" },
      price: "From $79/month",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Content Spawner",
      subtitle: "Viral Content Generator",
      description: "Generate 100+ viral pieces with AI that understands trending topics, audience psychology, and viral mechanics.",
      features: ["Viral content generation", "Trend analysis", "Audience targeting", "Multi-platform optimization", "Performance tracking", "A/B testing"],
      stats: { accuracy: "96.8%", speed: "15x faster", users: "100K+" },
      price: "From $99/month",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Live Dashboard",
      subtitle: "Analytics & Tracking",
      description: "Real-time analytics and insights with predictive modeling, automated reporting, and actionable recommendations.",
      features: ["Real-time analytics", "Predictive modeling", "Automated reporting", "Custom dashboards", "Data visualization", "Alert system"],
      stats: { accuracy: "99.5%", speed: "Real-time", users: "200K+" },
      price: "From $149/month",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Affiliate Portal",
      subtitle: "Referral System",
      description: "Complete affiliate management system with automated tracking, commission optimization, and performance analytics.",
      features: ["Automated tracking", "Commission optimization", "Performance analytics", "Multi-tier system", "Payment automation", "Fraud detection"],
      stats: { accuracy: "99.1%", speed: "Instant", users: "30K+" },
      price: "From $199/month",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-white font-bold text-xl">Omnipreneur</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-zinc-300 hover:text-white transition-colors">Products</a>
              <a href="#solutions" className="text-zinc-300 hover:text-white transition-colors">Solutions</a>
              <a href="#pricing" className="text-zinc-300 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-zinc-300 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-zinc-300 hover:text-white transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-zinc-300 hover:text-white transition-colors">Login</button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-zinc-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="text-white">AI-Powered Business</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-4xl mx-auto"
          >
            Transform your business with cutting-edge AI tools. Generate viral content, optimize performance, and scale your operations with unprecedented efficiency.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Get Started Free
            </button>
            <button className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-zinc-400">Bank-grade security for your data</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Analytics</h3>
              <p className="text-zinc-400">Live insights and performance tracking</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-zinc-400">Optimized for speed and performance</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Complete AI Suite
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Transform your business with our comprehensive suite of AI-powered tools. From content creation to analytics, we've got everything you need to scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {product.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-blue-400 font-medium mb-4">{product.subtitle}</p>
                <p className="text-zinc-400 mb-6">{product.description}</p>

                <div className="space-y-3 mb-6">
                  {product.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-zinc-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{product.stats.accuracy}</div>
                    <div className="text-xs text-zinc-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{product.stats.speed}</div>
                    <div className="text-xs text-zinc-400">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{product.stats.users}</div>
                    <div className="text-xs text-zinc-400">Users</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{product.price}</span>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Ready to transform your business with AI? Our team of experts is here to help you get started and answer any questions you might have.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email Us</h3>
                    <p className="text-zinc-400">hello@omnipreneur.ai</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Call Us</h3>
                    <p className="text-zinc-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Visit Us</h3>
                    <p className="text-zinc-400">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    placeholder="john@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    placeholder="Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Message *</label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 h-32"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <span className="text-white font-bold text-xl">Omnipreneur</span>
              </div>
              <p className="text-zinc-400 mb-4 max-w-md">
                Transform your business with cutting-edge AI tools. Generate viral content, optimize performance, and scale your operations with unprecedented efficiency.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">NOVUS Protocol</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">AutoRewrite Engine</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Bundle Builder</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Content Spawner</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Live Dashboard</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Affiliate Portal</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-zinc-400 text-sm">
              © 2024 Omnipreneur. All rights reserved. Made within San Francisco
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-zinc-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 