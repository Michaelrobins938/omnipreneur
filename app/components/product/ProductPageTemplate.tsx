'use client'

import React, { useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Star,
  ExternalLink,
  BookOpen,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/data/types';
import { getPricing } from '@/lib/data/pricing';
import CheckoutButton from '@/app/components/CheckoutButton';
import ProductAccessControl from '@/app/components/ProductAccessControl';

interface ProductPageTemplateProps {
  product: Product;
  demoContent?: React.ReactNode;
}

// Analytics event tracking
const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, properties);
  }
};

export default function ProductPageTemplate({ product, demoContent }: ProductPageTemplateProps) {
  const [activeDemo, setActiveDemo] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const pricingTiers = getPricing(product.pricingKey || product.id);

  const handleDemoClick = useCallback(() => {
    setActiveDemo(true);
    trackEvent('product_demo_launch', { 
      product: product.id, 
      location: 'product_page' 
    });
  }, [product.id]);

  const handlePricingClick = useCallback((tierId: string) => {
    trackEvent('pricing_select_tier', { 
      product: product.id, 
      tier: tierId 
    });
  }, [product.id]);

  // Dynamic icon rendering helper
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    // In a real implementation, you'd have a dynamic icon mapping
    // For now, using placeholder
    return <div className={`${className} bg-white/20 rounded`} />;
  };

  return (
    <ProductAccessControl 
      productId={product.id}
      productName={product.name}
      requiredPlans={[product.id.toUpperCase(), 'PRO', 'ENTERPRISE']}
      demoMode={!!product.demoLink}
    >
      <div className="min-h-screen bg-zinc-950">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${product.gradient[0]}/20 ${product.gradient[1]}/20`}
            style={{ y }}
          />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                className={`inline-flex items-center px-4 py-2 bg-${product.gradient[0].replace('from-', '')}/10 border border-${product.gradient[0].replace('from-', '')}/20 rounded-full text-${product.gradient[0].replace('from-', '')}-400 mb-6`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {product.name}
                <span className={`block bg-gradient-to-r ${product.gradient[0]} ${product.gradient[1]} bg-clip-text text-transparent`}>
                  {product.tagline.split(' ').slice(-2).join(' ')}
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {product.heroText || product.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link href="/auth/register">
                  <button className={`px-8 py-4 bg-gradient-to-r ${product.gradient[0]} ${product.gradient[1]} text-white rounded-full font-semibold text-lg hover:from-${product.gradient[0].replace('from-', '')}-600 hover:to-${product.gradient[1].replace('to-', '')}-600 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2`}>
                    <Zap className="w-5 h-5" />
                    <span>Start Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                
                {product.docsLink && (
                  <Link href={product.docsLink}>
                    <button className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>View Docs</span>
                    </button>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {product.metrics && product.metrics.length > 0 && (
          <section className="py-16 bg-zinc-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {product.metrics.slice(0, 4).map((metric, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      {metric.icon && renderIcon(metric.icon, "w-5 h-5")}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-sm text-zinc-400">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Everything you need to {product.tagline.toLowerCase()}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.features.slice(0, 6).map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-${product.gradient[0].replace('from-', '')}/10 border border-${product.gradient[0].replace('from-', '')}/20 rounded-lg text-${product.gradient[0].replace('from-', '')}-400 mr-4`}>
                      {feature.icon && renderIcon(feature.icon)}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-zinc-400">{feature.description || feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                See {product.name} in Action
              </h2>
              <p className="text-xl text-zinc-400">
                Experience the power of {product.name} with our interactive demo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              {demoContent ? (
                <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 backdrop-blur-xl">
                  {demoContent}
                </div>
              ) : (
                <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50 backdrop-blur-xl text-center">
                  <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center mb-6">
                    <button 
                      onClick={handleDemoClick}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors group"
                    >
                      <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Interactive Demo</h3>
                  <p className="text-zinc-400 mb-6">
                    Try {product.name} with sample data and see immediate results
                  </p>
                  {product.demoLink && (
                    <Link href={product.demoLink}>
                      <button 
                        onClick={handleDemoClick}
                        className={`px-6 py-3 bg-gradient-to-r ${product.gradient[0]} ${product.gradient[1]} text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto`}
                      >
                        <Play className="w-4 h-4" />
                        <span>Launch Demo</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose Your Plan
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Flexible pricing plans designed for {product.name.toLowerCase()}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative bg-zinc-800/30 rounded-2xl p-8 border backdrop-blur-xl ${
                    tier.popular 
                      ? `border-${product.gradient[0].replace('from-', '')}/50 shadow-${product.gradient[0].replace('from-', '')}/25` 
                      : 'border-zinc-700/50'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`bg-gradient-to-r ${product.gradient[0]} ${product.gradient[1]} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center space-x-1 mb-4">
                      <span className="text-4xl font-bold text-white">${tier.priceMonthly}</span>
                      <span className="text-zinc-400">/month</span>
                    </div>
                    {tier.description && (
                      <p className="text-zinc-400">{tier.description}</p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.bullets.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <CheckoutButton
                    productName={`${product.name} ${tier.name}`}
                    productId={`${product.id}-${tier.id}`}
                    price={{
                      monthly: tier.priceMonthly,
                      yearly: tier.priceYearly || tier.priceMonthly * 10
                    }}
                    features={tier.bullets}
                    className="w-full"
                    variant={tier.popular ? "primary" : "secondary"}
                    onClick={() => handlePricingClick(tier.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`py-20 bg-gradient-to-br ${product.gradient[0]}/10 ${product.gradient[1]}/10`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Join thousands of users already using {product.name}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/auth/register">
                  <button 
                    className={`px-8 py-4 bg-gradient-to-r ${product.gradient[0]} ${product.gradient[1]} text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2`}
                  >
                    <Star className="w-5 h-5" />
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              {/* Risk Reversal */}
              <div className="flex items-center justify-center space-x-6 text-sm text-zinc-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>30-day money back</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Secure payments</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </ProductAccessControl>
  );
}