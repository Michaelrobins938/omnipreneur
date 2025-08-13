"use client"
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Globe,
  ArrowUp,
  Zap,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles
} from 'lucide-react';
import SplashCursor from './SplashCursor';
import LetterGlitchBackground from './LetterGlitchBackground';

interface ProductFeature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

interface ProductStat {
  label: string;
  value: string;
  icon: React.ReactElement;
}

interface PricingPlan {
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  popular?: boolean;
  gradient?: string;
}

interface ProductPageTemplateProps {
  // Hero Section
  title: string;
  subtitle: string;
  description: string;
  heroIcon: React.ReactElement;
  heroGradient: string;
  
  // Features
  features: ProductFeature[];
  stats: ProductStat[];
  
  // Pricing
  pricingPlans: PricingPlan[];
  
  // Interactive Demo
  demoComponent?: React.ReactElement;
  
  // Product-specific functionality
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
  
  // Customization
  primaryColor?: string;
  accentColor?: string;
}

export default function ProductPageTemplate({
  title,
  subtitle,
  description,
  heroIcon,
  heroGradient,
  features,
  stats,
  pricingPlans,
  demoComponent,
  onGetStarted,
  onWatchDemo,
  primaryColor = "cyan",
  accentColor = "blue"
}: ProductPageTemplateProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <SplashCursor size={24} trailLength={6} opacity={0.4} />
      <LetterGlitchBackground />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative z-10 flex items-center justify-center px-6">
          <div className="text-center max-w-5xl">
            {/* Product Icon */}
            <motion.div
              className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-br ${heroGradient} rounded-3xl flex items-center justify-center shadow-lg`}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <motion.div 
                className="text-white text-4xl"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {heroIcon}
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              className={`text-2xl md:text-3xl font-semibold bg-gradient-to-r from-${primaryColor}-500 to-${accentColor}-500 bg-clip-text text-transparent mb-6`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {subtitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                onClick={onGetStarted}
                className={`px-8 py-4 bg-gradient-to-r from-${primaryColor}-500 to-${accentColor}-500 text-white rounded-full font-semibold text-lg hover:from-${primaryColor}-600 hover:to-${accentColor}-600 transition-all duration-300 shadow-lg hover:shadow-${primaryColor}-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 relative overflow-hidden group`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r from-${primaryColor}-400/20 to-${accentColor}-400/20`}
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={onWatchDemo}
                className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center justify-center gap-8 text-zinc-400 text-sm flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Lightning Fast</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${heroGradient} flex items-center justify-center mx-auto mb-4`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-white">{stat.icon}</div>
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-zinc-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Everything you need to transform your workflow and achieve unprecedented results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl hover:border-cyan-500/30 transition-all duration-300 group p-6"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: '0 25px 50px rgba(6, 182, 212, 0.1)'
                }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${heroGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {demoComponent && (
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Try It Live
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Experience the power firsthand with our interactive demo.
              </p>
            </motion.div>
            {demoComponent}
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple Pricing
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. Upgrade or downgrade at any time.
            </p>
          </motion.div>

          <div className={`grid ${pricingPlans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 max-w-5xl mx-auto`}>
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`bg-zinc-900/50 backdrop-blur-xl border ${
                  plan.popular ? 'border-cyan-500/50' : 'border-zinc-800'
                } rounded-2xl p-8 relative ${
                  plan.popular ? 'scale-105 shadow-2xl shadow-cyan-500/10' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: plan.popular ? 1.08 : 1.02 }}
              >
                {plan.popular && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${plan.gradient || heroGradient} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-xl text-zinc-400 line-through">{plan.originalPrice}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient || heroGradient} text-white hover:shadow-lg hover:shadow-cyan-500/25`
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                  onClick={onGetStarted}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-${primaryColor}-500 to-${accentColor}-500 text-white rounded-full shadow-lg hover:shadow-${primaryColor}-500/25 flex items-center justify-center z-50`}
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
        className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-${primaryColor}-500 to-${accentColor}-500 origin-left z-50`}
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}