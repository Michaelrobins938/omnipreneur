"use client";

import React, { memo, useEffect, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import useWindowSize from '../hooks/useWindowSize';

// Memoize individual product cards for better performance
const ProductCard = memo(({ product }) => (
  <div className="glass-card notched-card p-6 hover:neon-glow transition-all duration-300 group">
    <div className="flex items-center mb-4">
      <div className="text-4xl mr-4">{product.icon}</div>
      <div>
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        <span className="text-sm text-blue-400 font-medium">{product.category}</span>
      </div>
    </div>
    
    <p className="text-gray-300 mb-6 leading-relaxed">
      {product.description}
    </p>

    <div className="mb-6">
      <h4 className="text-sm font-semibold text-white mb-3">Key Features:</h4>
      <ul className="space-y-2">
        {product.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-center text-sm text-gray-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>

    <button className="w-full glass-button py-3 rounded-lg font-semibold text-white hover:text-blue-400 transition-all duration-300">
      Learn More
    </button>
  </div>
));

ProductCard.displayName = 'ProductCard';

// Memoize the NOVUS section
const NovusSection = memo(() => (
  <div className="glass-card notched-card p-8">
    <div className="text-center mb-8">
      <h3 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
        NOVUS - Our Flagship AI Agent
      </h3>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        The crown jewel of our suite - an autonomous AI agent that combines all our technologies into one powerful system
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="space-y-4">
          {[
            { color: 'green', text: 'Active Learning' },
            { color: 'blue', text: 'Autonomous Operation' },
            { color: 'purple', text: 'Multi-Platform Integration' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 bg-${item.color}-400 rounded-full`}></div>
              <span className={`text-${item.color}-400 font-semibold`}>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Task Completion</span>
              <span className="text-green-400 font-bold">98.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">User Satisfaction</span>
              <span className="text-blue-400 font-bold">96.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Revenue Generated</span>
              <span className="text-purple-400 font-bold">$2.3M+</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="glass-card p-8">
          <div className="text-6xl mb-6">🤖</div>
          <h4 className="text-2xl font-bold gradient-text mb-4">NOVUS Agent</h4>
          <p className="text-gray-300 mb-6">
            Experience the future of AI automation with our most advanced agent
          </p>
          <button className="glass-button px-8 py-4 rounded-lg font-semibold text-lg text-white hover:text-blue-400 transition-all duration-300">
            Access NOVUS
          </button>
        </div>
      </div>
    </div>
  </div>
));

NovusSection.displayName = 'NovusSection';

const ProjectsSection = () => {
  const { width } = useWindowSize();
  const products = [
    {
      name: "AutoRewrite Engine",
      description: "Transform any content into multiple high-converting variations using advanced AI rewriting algorithms.",
      features: ["50+ Writing Styles", "Bulk Processing", "SEO Optimization", "Plagiarism-Free"],
      category: "Content Creation",
      icon: "✍️"
    },
    {
      name: "Content Spawner",
      description: "Generate unlimited content ideas and full articles across any niche with intelligent topic research.",
      features: ["AI Topic Research", "Multi-Format Output", "Trend Analysis", "Content Calendar"],
      category: "Content Strategy",
      icon: "🚀"
    },
    {
      name: "Bundle Builder",
      description: "Create and package digital products automatically with professional sales pages and marketing materials.",
      features: ["Auto Sales Pages", "Payment Integration", "Email Sequences", "Analytics Dashboard"],
      category: "Product Creation",
      icon: "📦"
    },
    {
      name: "Live Dashboard",
      description: "Real-time analytics and performance tracking for all your AI-generated content and campaigns.",
      features: ["Real-time Metrics", "Performance Insights", "ROI Tracking", "Custom Reports"],
      category: "Analytics",
      icon: "📊"
    },
    {
      name: "Affiliate Portal",
      description: "Complete affiliate management system with automated commissions and marketing resources.",
      features: ["Commission Tracking", "Marketing Materials", "Payout Automation", "Performance Analytics"],
      category: "Marketing",
      icon: "🤝"
    },
    {
      name: "AutoNiche Engine",
      description: "Discover profitable niches and untapped markets using advanced AI market analysis.",
      features: ["Market Analysis", "Competition Research", "Trend Prediction", "Profit Estimation"],
      category: "Market Research",
      icon: "🎯"
    }
  ];

  // Calculate grid dimensions based on screen size
  const getGridConfig = () => {
    if (width >= 1024) return { columns: 3, itemWidth: Math.floor((width * 0.8) / 3) }; // lg
    if (width >= 768) return { columns: 2, itemWidth: Math.floor((width * 0.8) / 2) }; // md
    return { columns: 1, itemWidth: Math.floor(width * 0.8) }; // sm
  };

  const { columns, itemWidth } = getGridConfig();
  const itemHeight = 400; // Fixed height for each item
  const rowCount = Math.ceil(products.length / columns);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemIndex = rowIndex * columns + columnIndex;
    if (itemIndex >= products.length) return null;
    
    const product = products[itemIndex];
    
    return (
      <div style={style}>
        <ProductCard product={product} />
      </div>
    );
  };

  return (
    <section id="products" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Omnipreneur Product Suite
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Six powerful applications designed to transform your entrepreneurial journey from idea to $3-8K monthly passive income
          </p>
        </div>

        {width > 0 && (
          <FixedSizeGrid
            columnCount={columns}
            columnWidth={itemWidth}
            height={Math.min(rowCount * itemHeight, window.innerHeight * 0.8)}
            rowCount={rowCount}
            rowHeight={itemHeight}
            width={width * 0.8}
            className="mx-auto"
          >
            {Cell}
          </FixedSizeGrid>
        )}

        {/* NOVUS Special Section */}
        <div className="mt-20">
          <NovusSection />
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="glass-card notched-card p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 gradient-text">
              Ready to Scale Your Business?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join 500+ entrepreneurs already generating $3-8K monthly passive income with our suite
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="glass-button px-8 py-4 rounded-lg font-semibold text-lg text-white hover:text-blue-400 transition-all duration-300">
                Get Full Access
              </button>
              <button className="glass-button px-8 py-4 rounded-lg font-semibold text-lg text-white hover:text-purple-400 transition-all duration-300">
                Book Demo Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 