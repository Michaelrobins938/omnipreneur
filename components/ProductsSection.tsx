"use client";
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
  TrendingUp
} from 'lucide-react';

const ProductsSection = () => {
  const products = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "NOVUS Protocol",
      subtitle: "AI Prompt Optimizer",
      description: "Master-level AI prompt optimization using the 4-D methodology. Transform vague ideas into tactical weapons.",
      features: ["4-D Methodology", "Multi-Platform", "Enterprise Ready"],
      gradient: "from-purple-500 to-pink-500",
      href: "#novus"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AutoRewrite Engine",
      subtitle: "Content Refinement",
      description: "CAL™-powered content rewriting and optimization. Perfect tone, style, and clarity every time.",
      features: ["CAL™ Powered", "Tone Matching", "Style Optimization"],
      gradient: "from-cyan-500 to-blue-500",
      href: "#auto-rewrite"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Bundle Builder",
      subtitle: "Product Packaging",
      description: "Create high-converting product bundles with AI-generated copy and professional packaging.",
      features: ["ZIP Creation", "AI Copy", "Gumroad Ready"],
      gradient: "from-green-500 to-emerald-500",
      href: "#bundle-builder"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Content Spawner",
      subtitle: "Viral Content Generator",
      description: "Generate 100+ viral posts, carousels, and TikTok content with CAL™ optimization.",
      features: ["100+ Templates", "Multi-Format", "Viral Optimization"],
      gradient: "from-orange-500 to-red-500",
      href: "#content-spawner"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Live Dashboard",
      subtitle: "Analytics & Tracking",
      description: "Real-time tracking for launches, ROI, and performance metrics with intelligent insights.",
      features: ["Real-time Data", "ROI Tracking", "Smart Insights"],
      gradient: "from-blue-500 to-indigo-500",
      href: "#dashboard"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Affiliate Portal",
      subtitle: "Referral System",
      description: "Complete affiliate management system with tracking, payouts, and performance analytics.",
      features: ["Commission Tracking", "Payout System", "Performance Analytics"],
      gradient: "from-violet-500 to-purple-500",
      href: "#affiliate"
    }
  ];

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6"
          >
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">AI-Powered Solutions</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Complete AI Suite
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Transform your business with our comprehensive AI toolkit. Each tool is designed to work independently 
            or as part of the complete Omnipreneur ecosystem.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative glass-card h-full p-8">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <div className="text-white">
                    {product.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
                    <p className="text-blue-400 font-medium text-sm">{product.subtitle}</p>
                  </div>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {product.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.05) }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span className="text-zinc-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-zinc-800 to-zinc-700 border border-zinc-700 rounded-xl text-white font-medium hover:from-zinc-700 hover:to-zinc-600 transition-all duration-300"
                  >
                    Explore {product.title}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-zinc-400 mb-6">
              Join thousands of entrepreneurs who are already using our AI suite to scale their operations 
              and increase revenue.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection; 