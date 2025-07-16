"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const products = [
  {
    id: 'auto-rewrite',
    name: 'AutoRewrite Engine™',
    description: 'Transform any prompt into a tactical weapon with our proprietary CAL™ technology.',
    features: ['4-D Methodology', 'Multi-Platform Support', 'Enterprise Integration'],
    images: [
      '/auto_rewrite_engine_project/showcase images/2025-07-05 16_50_22-Mozilla Firefox.png',
      '/auto_rewrite_engine_project/showcase images/2025-07-05 16_51_07-Mozilla Firefox.png',
      '/auto_rewrite_engine_project/showcase images/2025-07-05 16_51_29-.png'
    ]
  },
  {
    id: 'auto-niche',
    name: 'AutoNiche Engine™',
    description: 'Discover untapped market opportunities with AI-powered niche analysis.',
    features: ['Real-Time Market Analysis', 'Profit Potential Scoring', 'Competitor Intelligence'],
    images: [
      '/auto-niche-engine/showcase images/2025-07-06 01_45_12-AutoNiche Engine™ - Elite KDP Discovery _ Omnipreneur — Mozilla Firefox.png',
      '/auto-niche-engine/showcase images/2025-07-06 01_46_04-AutoNiche Engine™ - Elite KDP Discovery _ Omnipreneur — Mozilla Firefox.png',
      '/auto-niche-engine/showcase images/2025-07-06 01_46_23-AutoNiche Engine™ - Elite KDP Discovery _ Omnipreneur — Mozilla Firefox.png'
    ]
  }
];

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState(products[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <section className="w-full py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 tracking-tight">
            Experience the Future
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Our suite of AI-powered tools transforms how businesses operate in the digital age.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Product Image Showcase */}
          <motion.div 
            className="relative aspect-video rounded-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl transform -rotate-1" />
            <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-2">
              <Image
                src={activeProduct.images[activeImageIndex]}
                alt={activeProduct.name}
                width={800}
                height={450}
                className="rounded-lg"
              />
              
              {/* Image Navigation */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {activeProduct.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeImageIndex ? 'bg-cyan-400 w-4' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
                {activeProduct.name}
              </h3>
              <p className="text-zinc-400">
                {activeProduct.description}
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4">
              {activeProduct.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-zinc-300"
                >
                  <span className="text-cyan-400">⚡</span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            {/* Product Navigation */}
            <div className="flex gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setActiveProduct(product);
                    setActiveImageIndex(0);
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeProduct.id === product.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {product.name.split('™')[0]}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase; 