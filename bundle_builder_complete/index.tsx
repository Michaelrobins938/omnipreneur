import React, { useState } from 'react';
import { BaseLayout } from '../layout/BaseLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { CodeBlock } from '../components/ui/CodeBlock';

export default function BundleBuilder() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [bundleConfig, setBundleConfig] = useState({
    name: '',
    price: '',
    products: [],
    description: '',
  });

  const handleBuildBundle = async () => {
    setIsBuilding(true);
    // Simulate API call
    setTimeout(() => {
      setIsBuilding(false);
    }, 3000);
  };

  return (
    <BaseLayout showGrid={true}>
      {/* Hero Section */}
      <section className="
        text-center py-20
        animate-fade-in
      ">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="
            text-5xl md:text-6xl font-display font-bold
            bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent
            mb-6
            animate-fade-in-up
          ">
            🚀 Bundle Builder
          </h1>
          
          {/* Subtitle */}
          <p className="
            text-xl md:text-2xl text-zinc-300
            mb-8 max-w-3xl mx-auto leading-relaxed
            animate-fade-in-up
            style={{ animationDelay: '0.2s' }}
          ">
            Create high-ticket digital product bundles that sell themselves — built for maximum profit.
          </p>
          
          {/* CTA Button */}
          <div className="
            flex flex-col sm:flex-row gap-4 justify-center items-center
            animate-fade-in-up
            style={{ animationDelay: '0.4s' }}
          ">
            <Button 
              size="lg" 
              loading={isBuilding}
              onClick={handleBuildBundle}
              className="
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700
                text-lg px-8 py-4
                shadow-lg hover:shadow-glow
              "
            >
              {isBuilding ? 'Building Bundle...' : 'Build Bundle'}
            </Button>
            
            <Button variant="outline" size="lg" className="
              text-lg px-8 py-4
              border-zinc-600 hover:border-indigo-500
            ">
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Bundle Configuration */}
      <section className="
        py-16
        animate-fade-in-up
        style={{ animationDelay: '0.6s' }}
      ">
        <div className="max-w-4xl mx-auto">
          <h2 className="
            text-3xl font-display font-semibold text-white text-center mb-12
          ">
            Configure Your Profit Bundle
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bundle Setup */}
            <Card variant="glass">
              <h3 className="text-xl font-semibold text-white mb-6">
                Bundle Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Bundle Name
                  </label>
                  <Input
                    variant="glass"
                    placeholder="e.g., Ultimate Productivity Masterclass"
                    value={bundleConfig.name}
                    onChange={(e) => setBundleConfig({...bundleConfig, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Price Point
                  </label>
                  <Input
                    type="number"
                    variant="glass"
                    placeholder="997"
                    value={bundleConfig.price}
                    onChange={(e) => setBundleConfig({...bundleConfig, price: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Bundle Type
                  </label>
                  <select className="
                    w-full px-4 py-3 text-sm text-white
                    bg-zinc-900/50 border border-zinc-700 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-950
                    transition-all duration-200
                    backdrop-blur-sm
                  ">
                    <option value="course">Course Bundle</option>
                    <option value="template">Template Pack</option>
                    <option value="toolkit">Toolkit Bundle</option>
                    <option value="masterclass">Masterclass Series</option>
                    <option value="software">Software Suite</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Target Audience
                  </label>
                  <select className="
                    w-full px-4 py-3 text-sm text-white
                    bg-zinc-900/50 border border-zinc-700 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-950
                    transition-all duration-200
                    backdrop-blur-sm
                  ">
                    <option value="entrepreneurs">Entrepreneurs</option>
                    <option value="creators">Content Creators</option>
                    <option value="professionals">Professionals</option>
                    <option value="students">Students</option>
                    <option value="businesses">Small Businesses</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="
                      w-full px-4 py-3 text-sm text-white
                      bg-zinc-900/50 border border-zinc-700 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-950
                      transition-all duration-200
                      backdrop-blur-sm
                      resize-none
                      rows={4
                    "
                    placeholder="Describe your bundle's value proposition..."
                    value={bundleConfig.description}
                    onChange={(e) => setBundleConfig({...bundleConfig, description: e.target.value})}
                  />
                </div>
              </div>
            </Card>

            {/* Bundle Preview */}
            <Card variant="gradient">
              <h3 className="text-xl font-semibold text-white mb-6">
                Bundle Preview
              </h3>
              
              {bundleConfig.name ? (
                <div className="space-y-4">
                  <div className="
                    p-4 bg-zinc-900/50 rounded-lg border border-zinc-700
                  ">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {bundleConfig.name}
                    </h4>
                    {bundleConfig.price && (
                      <div className="text-2xl font-bold text-indigo-400 mb-2">
                        ${bundleConfig.price}
                      </div>
                    )}
                    {bundleConfig.description && (
                      <p className="text-sm text-zinc-300">
                        {bundleConfig.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="
                    p-4 bg-zinc-900/50 rounded-lg border border-zinc-700
                  ">
                    <h5 className="text-sm font-semibold text-white mb-2">
                      Included Products:
                    </h5>
                    <ul className="text-sm text-zinc-300 space-y-1">
                      <li>• Main Course/Product</li>
                      <li>• Bonus Templates</li>
                      <li>• Implementation Guide</li>
                      <li>• Community Access</li>
                      <li>• Lifetime Updates</li>
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Generate Sales Page
                  </Button>
                </div>
              ) : (
                <div className="
                  text-center py-12
                  text-zinc-400
                ">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p>Your bundle preview will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="
        py-16
        animate-fade-in-up
        style={{ animationDelay: '0.8s' }}
      ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <Card variant="glass" className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              High-Ticket Pricing
            </h3>
            <p className="text-zinc-400">
              Optimize pricing for maximum profit with AI-driven market analysis.
            </p>
          </Card>

          {/* Feature Card 2 */}
          <Card variant="glass" className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Sales Copy Generator
            </h3>
            <p className="text-zinc-400">
              Generate compelling sales pages and marketing materials automatically.
            </p>
          </Card>

          {/* Feature Card 3 */}
          <Card variant="glass" className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Profit Optimization
            </h3>
            <p className="text-zinc-400">
              Maximize revenue with bundle strategies that increase perceived value.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="
        py-16
        animate-fade-in-up
        style={{ animationDelay: '1s' }}
      ">
        <div className="max-w-4xl mx-auto">
          <h2 className="
            text-3xl font-display font-semibold text-white text-center mb-12
          ">
            Bundle Pricing Tiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Tier */}
            <Card variant="glass" className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Basic</h3>
              <div className="text-3xl font-bold text-white mb-6">$97</div>
              <ul className="text-sm text-zinc-400 space-y-2 mb-6">
                <li>• Core Product</li>
                <li>• Basic Templates</li>
                <li>• Email Support</li>
                <li>• 30-Day Access</li>
              </ul>
              <Button variant="outline" className="w-full">
                Choose Basic
              </Button>
            </Card>

            {/* Pro Tier */}
            <Card variant="gradient" className="text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Pro</h3>
              <div className="text-3xl font-bold text-white mb-6">$297</div>
              <ul className="text-sm text-zinc-400 space-y-2 mb-6">
                <li>• Core Product</li>
                <li>• Premium Templates</li>
                <li>• Bonus Resources</li>
                <li>• Priority Support</li>
                <li>• Lifetime Access</li>
              </ul>
              <Button className="w-full">
                Choose Pro
              </Button>
            </Card>

            {/* Enterprise Tier */}
            <Card variant="glass" className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise</h3>
              <div className="text-3xl font-bold text-white mb-6">$997</div>
              <ul className="text-sm text-zinc-400 space-y-2 mb-6">
                <li>• Everything in Pro</li>
                <li>• Custom Implementation</li>
                <li>• 1-on-1 Coaching</li>
                <li>• White-label Rights</li>
                <li>• Reseller License</li>
              </ul>
              <Button variant="outline" className="w-full">
                Choose Enterprise
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="
        py-16
        animate-fade-in-up
        style={{ animationDelay: '1.2s' }}
      ">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                $2.4M
              </div>
              <div className="text-zinc-400">
                Revenue Generated
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                15K+
              </div>
              <div className="text-zinc-400">
                Bundles Created
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                47%
              </div>
              <div className="text-zinc-400">
                Average Conversion
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="
        py-16
        animate-fade-in-up
        style={{ animationDelay: '1.4s' }}
      ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="
            text-3xl md:text-4xl font-display font-semibold text-white mb-6
          ">
            Ready to Build Your Profit Bundle?
          </h2>
          <p className="
            text-xl text-zinc-300 mb-8 max-w-2xl mx-auto
          ">
            Join entrepreneurs who've generated millions with AI-powered bundle strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              text-xl px-10 py-5
              shadow-lg hover:shadow-glow
            ">
              Start Building
            </Button>
            <Button variant="outline" size="xl" className="
              text-xl px-10 py-5
              border-zinc-600 hover:border-indigo-500
            ">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 