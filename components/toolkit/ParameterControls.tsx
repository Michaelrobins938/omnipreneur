'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ParameterControlsProps {
  productId: string;
  parameters: Record<string, any>;
  onParametersChange: (parameters: Record<string, any>) => void;
}

export default function ParameterControls({ productId, parameters, onParametersChange }: ParameterControlsProps) {
  const updateParameter = (key: string, value: any) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  const renderAutoRewriteControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Writing Style</label>
          <Select value={parameters.style || 'professional'} onValueChange={(value) => updateParameter('style', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="concise">Concise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Tone Control</label>
          <Select value={parameters.tone || 'professional'} onValueChange={(value) => updateParameter('tone', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="authoritative">Authoritative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Length Adjustment</label>
          <Select value={parameters.lengthControl || 'maintain'} onValueChange={(value) => updateParameter('lengthControl', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="expand">Expand</SelectItem>
              <SelectItem value="condense">Condense</SelectItem>
              <SelectItem value="maintain">Maintain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Target Audience</label>
          <Select value={parameters.audience || 'general'} onValueChange={(value) => updateParameter('audience', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Purpose</label>
          <Select value={parameters.purpose || 'inform'} onValueChange={(value) => updateParameter('purpose', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="inform">Inform</SelectItem>
              <SelectItem value="persuade">Persuade</SelectItem>
              <SelectItem value="entertain">Entertain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">SEO Keywords (comma-separated)</label>
        <input
          type="text"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="keyword1, keyword2, keyword3"
          value={parameters.seoKeywords || ''}
          onChange={(e) => updateParameter('seoKeywords', e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.seoOptimization || false}
            onChange={(e) => updateParameter('seoOptimization', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">SEO Optimization</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.grammarCheck || false}
            onChange={(e) => updateParameter('grammarCheck', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Grammar Check</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.plagiarismDetection || false}
            onChange={(e) => updateParameter('plagiarismDetection', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Plagiarism Detection</span>
        </label>
      </div>
    </div>
  );

  const renderContentSpawnerControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Content Platform</label>
          <Select value={parameters.platform || 'general'} onValueChange={(value) => updateParameter('platform', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Content Format</label>
          <Select value={parameters.format || 'article'} onValueChange={(value) => updateParameter('format', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="post">Social Post</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="script">Video Script</SelectItem>
              <SelectItem value="thread">Thread</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Target Audience</label>
          <Select value={parameters.targetAudience || 'general'} onValueChange={(value) => updateParameter('targetAudience', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="millennials">Millennials</SelectItem>
              <SelectItem value="genz">Gen Z</SelectItem>
              <SelectItem value="professionals">Professionals</SelectItem>
              <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Content Variants</label>
          <Select value={parameters.variants?.toString() || '3'} onValueChange={(value) => updateParameter('variants', parseInt(value))}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="1">1 Variant</SelectItem>
              <SelectItem value="3">3 Variants</SelectItem>
              <SelectItem value="5">5 Variants</SelectItem>
              <SelectItem value="10">10 Variants</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Trending Topics (comma-separated)</label>
        <input
          type="text"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="trending topic 1, trending topic 2"
          value={parameters.trendingTopics || ''}
          onChange={(e) => updateParameter('trendingTopics', e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4 flex-wrap">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.viralOptimization || false}
            onChange={(e) => updateParameter('viralOptimization', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Viral Optimization</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.hashtagOptimization || false}
            onChange={(e) => updateParameter('hashtagOptimization', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Hashtag Optimization</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.engagementPrediction || false}
            onChange={(e) => updateParameter('engagementPrediction', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Engagement Prediction</span>
        </label>
      </div>
    </div>
  );

  const renderBundleBuilderControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Pricing Strategy</label>
          <Select value={parameters.pricingStrategy || 'value'} onValueChange={(value) => updateParameter('pricingStrategy', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="value">Value-Based</SelectItem>
              <SelectItem value="competitive">Competitive</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Discount Strategy</label>
          <Select value={parameters.discountStrategy || 'tiered'} onValueChange={(value) => updateParameter('discountStrategy', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="tiered">Tiered Discounts</SelectItem>
              <SelectItem value="bulk">Bulk Pricing</SelectItem>
              <SelectItem value="early">Early Bird</SelectItem>
              <SelectItem value="seasonal">Seasonal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Target Platform</label>
          <Select value={parameters.targetPlatform || 'gumroad'} onValueChange={(value) => updateParameter('targetPlatform', value)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="gumroad">Gumroad</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="woocommerce">WooCommerce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Bundle Size</label>
          <Select value={parameters.bundleSize?.toString() || '3'} onValueChange={(value) => updateParameter('bundleSize', parseInt(value))}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="2">2 Products</SelectItem>
              <SelectItem value="3">3 Products</SelectItem>
              <SelectItem value="5">5 Products</SelectItem>
              <SelectItem value="10">10 Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-wrap">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.conversionOptimization || false}
            onChange={(e) => updateParameter('conversionOptimization', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Conversion Optimization</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.revenueMaximization || false}
            onChange={(e) => updateParameter('revenueMaximization', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Revenue Maximization</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500"
            checked={parameters.customerSatisfaction || false}
            onChange={(e) => updateParameter('customerSatisfaction', e.target.checked)}
          />
          <span className="text-sm text-zinc-300">Customer Satisfaction</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Target Revenue ($)</label>
        <input
          type="number"
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="10000"
          value={parameters.targetRevenue || ''}
          onChange={(e) => updateParameter('targetRevenue', parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );

  const renderControls = () => {
    switch (productId) {
      case 'auto-rewrite':
        return renderAutoRewriteControls();
      case 'content-spawner':
        return renderContentSpawnerControls();
      case 'bundle-builder':
        return renderBundleBuilderControls();
      default:
        return (
          <div className="text-zinc-400 text-center py-8">
            Parameter controls not configured for this tool.
          </div>
        );
    }
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Advanced Options</h3>
        <Badge variant="secondary" className="bg-blue-600 text-white">
          Professional Settings
        </Badge>
      </div>
      {renderControls()}
    </div>
  );
}