"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  CheckCircle,
  Shield,
  Play,
  Star,
  Heart,
  Globe,
  ArrowUp
} from 'lucide-react';
import { 
  FaRocket, 
  FaChartLine, 
  FaBullseye, 
  FaUsers, 
  FaBox, 
  FaBrain, 
  FaChartBar, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaPlay, 
  FaStar, 
  FaHeart, 
  FaGlobe, 
  FaArrowUp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCog,
  FaBars
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdAccessTime,
  MdSend,
  MdSettings,
  MdMenu
} from 'react-icons/md';
import { 
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineLightningBolt,
  HiOutlineGlobe,
  HiOutlineArrowUp
} from 'react-icons/hi';
import SplashCursor from './components/SplashCursor';
import StarBorder from './components/StarBorder';
import LetterGlitchBackground from './components/LetterGlitchBackground';
import ProfileCard from './components/ProfileCard';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const products = [
    {
      icon: <FaBrain className="w-8 h-8" />,
      title: "NOVUS Protocol",
      subtitle: "AI Prompt Optimizer",
      description: "Revolutionary AI prompt engineering that transforms your ideas into optimized, high-converting content with unprecedented accuracy.",
      features: ["Advanced prompt engineering", "Real-time optimization", "Multi-language support", "Performance analytics", "Custom templates", "API integration"],
      stats: { accuracy: "99.2%", speed: "10x faster", users: "50K+" },
      price: "From $29/month",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <HiOutlineSparkles className="w-8 h-8" />,
      title: "AutoRewrite Engine",
      subtitle: "Content Refinement",
      description: "Intelligent content rewriting that maintains your voice while optimizing for engagement, SEO, and conversion rates.",
      features: ["Smart content rewriting", "SEO optimization", "Tone preservation", "Plagiarism detection", "Bulk processing", "Version control"],
      stats: { accuracy: "98.7%", speed: "5x faster", users: "75K+" },
      price: "From $49/month",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <HiOutlineCube className="w-8 h-8" />,
      title: "Bundle Builder",
      subtitle: "Product Packaging",
      description: "Create premium digital products and courses with AI-powered packaging, pricing optimization, and marketing automation.",
      features: ["AI-powered packaging", "Pricing optimization", "Marketing automation", "Sales funnel builder", "Analytics dashboard", "Customer segmentation"],
      stats: { accuracy: "97.5%", speed: "8x faster", users: "25K+" },
      price: "From $79/month",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <HiOutlineLightningBolt className="w-8 h-8" />,
      title: "Content Spawner",
      subtitle: "Viral Content Generator",
      description: "Generate 100+ viral pieces with AI that understands trending topics, audience psychology, and viral mechanics.",
      features: ["Viral content generation", "Trend analysis", "Audience targeting", "Multi-platform optimization", "Performance tracking", "A/B testing"],
      stats: { accuracy: "96.8%", speed: "15x faster", users: "100K+" },
      price: "From $99/month",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <HiOutlineChartBar className="w-8 h-8" />,
      title: "Live Dashboard",
      subtitle: "Analytics & Tracking",
      description: "Real-time analytics and insights with predictive modeling, automated reporting, and actionable recommendations.",
      features: ["Real-time analytics", "Predictive modeling", "Automated reporting", "Custom dashboards", "Data visualization", "Alert system"],
      stats: { accuracy: "99.5%", speed: "Real-time", users: "200K+" },
      price: "From $149/month",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: <HiOutlineUserGroup className="w-8 h-8" />,
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
      <SplashCursor size={24} trailLength={6} opacity={0.4} />
      <LetterGlitchBackground />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              The Future of
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                AI-Powered Business
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform your business with cutting-edge AI tools. Generate viral content, optimize performance, and scale your operations with unprecedented efficiency.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Started Free</span>
                <FaArrowUp className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center justify-center gap-8 text-zinc-400 text-sm mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <FaShieldAlt className="w-4 h-4 text-green-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <FaChartLine className="w-4 h-4 text-blue-400" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineLightningBolt className="w-4 h-4 text-purple-400" />
                <span>Lightning Fast</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              {
                icon: HiOutlineSparkles,
                title: 'AI-Powered Content',
                description: 'Generate 100+ viral pieces with advanced AI',
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                icon: HiOutlineChartBar,
                title: 'Real-time Analytics',
                description: 'Live dashboard with performance insights',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: HiOutlineTag,
                title: 'Precision Automation',
                description: 'Streamlined workflows and optimization',
                gradient: 'from-blue-500 to-cyan-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.1)' }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {[
              {
                icon: HiOutlineUserGroup,
                number: '50,000',
                label: 'Active Users',
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                icon: FaChartBar,
                number: '1,000,000',
                label: 'Content Generated',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: FaCheckCircle,
                number: '98%',
                label: 'Success Rate',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: HiOutlineGlobe,
                number: '150 countries',
                label: 'Global Reach',
                gradient: 'from-blue-500 to-cyan-500'
              }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-zinc-400 text-sm">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>



      {/* Products Section */}
      <section id="products" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Complete AI Suite
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-6">
              for Modern Business
            </h3>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Transform your business with our comprehensive suite of AI-powered tools. From content creation to analytics, we've got everything you need to scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden p-6"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: '0 25px 50px rgba(6, 182, 212, 0.1)'
                }}
              >
                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="text-white"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.icon}
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-blue-400 font-medium mb-4">{product.subtitle}</p>
                <p className="text-zinc-400 mb-6">{product.description}</p>

                <div className="space-y-3 mb-6">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <FaCheckCircle className="w-4 h-4 text-green-400" />
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
      <section id="contact" className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-3xl font-bold text-white mb-8">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Full Name *</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Email Address *</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Company</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Message *</label>
                  <textarea
                    className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 h-32 resize-none"
                    placeholder="Tell us about your project or questions..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105"
                >
                  <span>Send Message</span>
                  <MdSend className="w-5 h-5" />
                </button>
              </form>
            </motion.div>

            {/* Right Side - Contact Information Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MdEmail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Email Us</h3>
                      <p className="text-zinc-400 text-sm mb-1">Get in touch with our team</p>
                      <a href="mailto:hello@omnipreneur.ai" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">hello@omnipreneur.ai</a>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MdPhone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Call Us</h3>
                      <p className="text-zinc-400 text-sm mb-1">Speak with our experts</p>
                      <a href="tel:+15551234567" className="text-purple-400 hover:text-purple-300 underline transition-colors">+1 (555) 123-4567</a>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MdLocationOn className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Visit Us</h3>
                      <p className="text-zinc-400 text-sm mb-1">Our headquarters</p>
                      <span className="text-green-400 underline">San Francisco, CA</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-orange-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MdAccessTime className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">Business Hours</h3>
                      <p className="text-zinc-400 text-sm mb-1">When we're available</p>
                      <span className="text-orange-400">Mon-Fri 9AM-6PM PST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-zinc-300">24/7 Expert Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-zinc-300">Custom AI Solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-zinc-300">Enterprise Security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-zinc-300">Scalable Infrastructure</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              <a href="#" className="hover:text-white transition-colors underline">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors underline">Security</a>
              <a href="#" className="hover:text-white transition-colors underline">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors underline">Accessibility</a>
              <a href="#" className="hover:text-white transition-colors underline">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors underline">GDPR Compliance</a>
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
              <a href="#" className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
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