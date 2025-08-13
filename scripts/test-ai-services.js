// Test script for AI services integration
// Run with: node test-ai-services.js

const { ContentSpawnerService } = require('./lib/ai/content-spawner-service');
const { AutoRewriteService } = require('./lib/ai/auto-rewrite-service');
const { BundleBuilderService } = require('./lib/ai/bundle-builder-service');
const { AutoNicheEngineService } = require('./lib/ai/auto-niche-engine-service');

async function testContentGeneration() {
  console.log('🎯 Testing Content Generation Service...');
  
  try {
    const service = new ContentSpawnerService();
    const request = {
      contentType: 'SOCIAL',
      niche: 'digital marketing',
      keywords: 'SEO, content strategy',
      tone: 'professional',
      platform: 'linkedin',
      targetAudience: 'marketing professionals',
      quantity: 3
    };
    
    const result = await service.process(request);
    
    console.log('✅ Content Generation Test Results:');
    console.log(`- Generated ${result.content.length} pieces`);
    console.log(`- Average Viral Score: ${result.metrics.avgViralScore.toFixed(2)}`);
    console.log(`- Platform Optimizations: ${result.content[0].platformOptimizations ? 'Present' : 'Missing'}`);
    console.log(`- Suggestions: ${result.suggestions.length} provided`);
    
    return true;
  } catch (error) {
    console.error('❌ Content Generation Test Failed:', error.message);
    return false;
  }
}

async function testAutoRewrite() {
  console.log('\n🔄 Testing Auto-Rewrite Service...');
  
  try {
    const service = new AutoRewriteService();
    const request = {
      originalText: 'This is a test sentence that needs to be rewritten for better clarity and engagement.',
      targetStyle: 'improve',
      targetAudience: 'business',
      tone: 'professional'
    };
    
    const result = await service.process(request);
    
    console.log('✅ Auto-Rewrite Test Results:');
    console.log(`- Original length: ${result.original.length} chars`);
    console.log(`- Rewritten length: ${result.rewrittenContent.length} chars`);
    console.log(`- Improvement Score: ${result.analysis.improvements.overall.toFixed(2)}`);
    console.log(`- Changes Made: ${result.changes.length}`);
    console.log(`- Alternatives: ${result.alternatives.length} provided`);
    
    return true;
  } catch (error) {
    console.error('❌ Auto-Rewrite Test Failed:', error.message);
    return false;
  }
}

async function testBundleBuilder() {
  console.log('\n📦 Testing Bundle Builder Service...');
  
  try {
    const service = new BundleBuilderService();
    const request = {
      products: [
        {
          id: '1',
          name: 'SEO Guide',
          price: 29,
          type: 'ebook',
          description: 'Complete SEO optimization guide'
        },
        {
          id: '2', 
          name: 'Content Templates',
          price: 19,
          type: 'template',
          description: 'Ready-to-use content templates'
        }
      ],
      targetAudience: 'Small business owners',
      category: 'marketing',
      marketplaces: ['gumroad', 'etsy'],
      priceStrategy: 'value'
    };
    
    const result = await service.process(request);
    
    console.log('✅ Bundle Builder Test Results:');
    console.log(`- Bundle Name: ${result.bundleName}`);
    console.log(`- Synergy Score: ${result.analysis.synergyScore}`);
    console.log(`- Recommended Price: $${result.pricing.recommendedPrice}`);
    console.log(`- Marketing Headlines: ${result.marketing.headlines.length}`);
    console.log(`- Launch Timeline: ${result.launchStrategy.timeline.length} phases`);
    
    return true;
  } catch (error) {
    console.error('❌ Bundle Builder Test Failed:', error.message);
    return false;
  }
}

async function testNicheDiscovery() {
  console.log('\n🎯 Testing Niche Discovery Service...');
  
  try {
    const service = new AutoNicheEngineService();
    const request = {
      keyword: 'productivity tools',
      platform: 'shopify',
      targetAudience: 'remote workers',
      analysisDepth: 'standard',
      competitionLevel: 'medium'
    };
    
    const result = await service.process(request);
    
    console.log('✅ Niche Discovery Test Results:');
    console.log(`- Niches Found: ${result.niches.length}`);
    console.log(`- Opportunity Score: ${result.niches[0].opportunityScore}`);
    console.log(`- Market Size: $${result.marketAnalysis.totalMarketSize}M`);
    console.log(`- Keyword Suggestions: ${result.keywordSuggestions.length}`);
    console.log(`- Action Plan Steps: ${result.actionPlan.immediate.length} immediate`);
    
    return true;
  } catch (error) {
    console.error('❌ Niche Discovery Test Failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI Services Integration Tests...\n');
  
  const tests = [
    testContentGeneration,
    testAutoRewrite,
    testBundleBuilder,
    testNicheDiscovery
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const success = await test();
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All AI services are working correctly!');
  } else {
    console.log('\n⚠️  Some tests failed - check the error messages above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testContentGeneration,
  testAutoRewrite,
  testBundleBuilder,
  testNicheDiscovery,
  runAllTests
};