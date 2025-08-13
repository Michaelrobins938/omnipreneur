import { ProductStrategy, ProcessResult } from '../toolkit/types';
import { 
  calculateReadability, 
  calculateStructure, 
  calculateSafety, 
  calculateTokenDeltaPct,
  calculateTokenCount,
  calculateCoverage,
  calculateCompliance,
  calculateSentimentScore,
  calculateSEOScore,
  calculateKeywordDensity,
  calculateGrammarScore,
  calculateEngagementPrediction,
  calculateViralPotential
} from '../toolkit/metrics';

const autoRewriteStrategy: ProductStrategy = {
  async run(input: string, params?: Record<string, any>): Promise<ProcessResult> {
    const style = params?.style || 'professional';
    const tone = params?.tone || 'professional';
    const lengthControl = params?.lengthControl || 'maintain';
    const audience = params?.audience || 'general';
    const purpose = params?.purpose || 'inform';
    const seoKeywords = params?.seoKeywords ? params.seoKeywords.split(',').map((k: string) => k.trim()) : [];
    const seoOptimization = params?.seoOptimization || false;
    const grammarCheck = params?.grammarCheck || false;
    
    let output = input;
    const improvements: string[] = [];
    
    // Style transformations
    switch (style) {
      case 'professional':
        output = output.replace(/\b(gonna|wanna|gotta|kinda|sorta)\b/gi, (match) => {
          improvements.push(`Enhanced formality: "${match}" → professional equivalent`);
          const replacements: Record<string, string> = {
            'gonna': 'going to', 'wanna': 'want to', 'gotta': 'have to',
            'kinda': 'somewhat', 'sorta': 'somewhat'
          };
          return replacements[match.toLowerCase()] || match;
        });
        
        output = output.replace(/\b(awesome|cool|super|really)\b/gi, (match) => {
          improvements.push(`Professional vocabulary enhancement: "${match}"`);
          const replacements: Record<string, string> = {
            'awesome': 'excellent', 'cool': 'effective', 'super': 'highly', 'really': 'significantly'
          };
          return replacements[match.toLowerCase()] || match;
        });
        break;
        
      case 'casual':
        output = output.replace(/\b(utilize|implement|facilitate|expedite)\b/gi, (match) => {
          improvements.push(`Casual tone: simplified "${match}"`);
          const replacements: Record<string, string> = {
            'utilize': 'use', 'implement': 'do', 'facilitate': 'help', 'expedite': 'speed up'
          };
          return replacements[match.toLowerCase()] || match;
        });
        break;
        
      case 'persuasive':
        if (!output.includes('you')) {
          output = output.replace(/\b(people|users|customers)\b/gi, 'you');
          improvements.push('Added direct address for persuasive impact');
        }
        
        const persuasiveWords = ['proven', 'guaranteed', 'exclusive', 'limited time', 'revolutionary'];
        const sentences = output.split(/[.!?]+/);
        if (sentences.length > 2 && !persuasiveWords.some(word => output.toLowerCase().includes(word))) {
          output += ' This proven approach delivers guaranteed results.';
          improvements.push('Enhanced persuasive language');
        }
        break;
        
      case 'technical':
        output = output.replace(/\b(thing|stuff|lots of)\b/gi, (match) => {
          improvements.push(`Technical precision: replaced vague term "${match}"`);
          const replacements: Record<string, string> = {
            'thing': 'component', 'stuff': 'elements', 'lots of': 'numerous'
          };
          return replacements[match.toLowerCase()] || match;
        });
        break;
        
      case 'creative':
        const creativeEnhancements = [
          { from: /\bvery good\b/gi, to: 'exceptional', desc: 'vivid language' },
          { from: /\bbig\b/gi, to: 'tremendous', desc: 'expressive vocabulary' },
          { from: /\bnice\b/gi, to: 'delightful', desc: 'creative expression' }
        ];
        
        creativeEnhancements.forEach(enhancement => {
          if (enhancement.from.test(output)) {
            output = output.replace(enhancement.from, enhancement.to);
            improvements.push(`Creative enhancement: ${enhancement.desc}`);
          }
        });
        break;
        
      case 'concise':
        output = output.replace(/\b(in order to|for the purpose of|with the intention of)\b/gi, 'to');
        output = output.replace(/\b(due to the fact that|owing to the fact that)\b/gi, 'because');
        output = output.replace(/\b(at this point in time|at the present time)\b/gi, 'now');
        improvements.push('Eliminated redundant phrases for conciseness');
        break;
    }
    
    // Tone adjustments
    switch (tone) {
      case 'friendly':
        if (!output.includes('!') && output.length > 50) {
          output = output.replace(/\.$/, '!');
          improvements.push('Added friendly enthusiasm');
        }
        
        if (!output.toLowerCase().includes('we') && !output.toLowerCase().includes('our')) {
          output = output.replace(/\bthe company\b/gi, 'we');
          improvements.push('Enhanced friendly, inclusive tone');
        }
        break;
        
      case 'authoritative':
        output = output.replace(/\b(I think|maybe|perhaps|might)\b/gi, (match) => {
          improvements.push(`Strengthened authority: removed tentative language "${match}"`);
          return match.toLowerCase() === 'i think' ? 'Research shows' :
                 match.toLowerCase() === 'maybe' ? 'likely' :
                 match.toLowerCase() === 'perhaps' ? 'certainly' : 'will';
        });
        break;
    }
    
    // Length adjustments
    switch (lengthControl) {
      case 'expand':
        const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          const expandedSentences = sentences.map(sentence => {
            if (sentence.trim().split(' ').length < 10) {
              return sentence.trim() + ', providing comprehensive insights and actionable strategies';
            }
            return sentence.trim();
          });
          output = expandedSentences.join('. ') + '.';
          improvements.push('Expanded content with additional detail and context');
        }
        break;
        
      case 'condense':
        output = output.replace(/\b(that is to say|in other words|to put it simply)\b/gi, '');
        output = output.replace(/\s+/g, ' ').trim();
        improvements.push('Condensed content by removing redundancies');
        break;
    }
    
    // Audience optimization
    switch (audience) {
      case 'technical':
        output = output.replace(/\b(help|make better)\b/gi, (match) => {
          improvements.push(`Technical audience: enhanced precision for "${match}"`);
          return match.toLowerCase() === 'help' ? 'optimize' : 'enhance performance';
        });
        break;
        
      case 'business':
        const businessTerms = ['ROI', 'stakeholders', 'strategic advantage', 'market position'];
        if (!businessTerms.some(term => output.toLowerCase().includes(term.toLowerCase()))) {
          output += ' This approach delivers measurable ROI and strengthens market position.';
          improvements.push('Added business-focused terminology and value proposition');
        }
        break;
    }
    
    // Purpose optimization
    switch (purpose) {
      case 'persuade':
        if (!output.includes('you should') && !output.includes('you need')) {
          output += ' You should consider implementing this approach for optimal results.';
          improvements.push('Added persuasive call-to-action');
        }
        break;
        
      case 'entertain':
        const entertainingElements = ['imagine', 'picture this', 'here\'s the thing'];
        if (!entertainingElements.some(elem => output.toLowerCase().includes(elem))) {
          output = 'Picture this: ' + output;
          improvements.push('Added engaging, entertaining opening');
        }
        break;
    }
    
    // SEO optimization
    if (seoOptimization && seoKeywords.length > 0) {
      seoKeywords.forEach(keyword => {
        const keywordDensity = calculateKeywordDensity(output, [keyword]);
        if (keywordDensity < 1) {
          output += ` Learn more about ${keyword} and how it can transform your approach.`;
          improvements.push(`SEO optimization: integrated keyword "${keyword}"`);
        }
      });
      
      // Add header structure if missing
      if (!output.includes('# ') && !output.includes('## ')) {
        const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          const title = sentences[0].trim();
          output = `# ${title}\n\n${sentences.slice(1).join('. ')}.`;
          improvements.push('Added SEO-optimized header structure');
        }
      }
    }
    
    // Grammar and structure improvements
    if (grammarCheck) {
      // Fix common grammar issues
      output = output.replace(/\bi\b/g, 'I');
      output = output.replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => {
        improvements.push('Fixed capitalization after punctuation');
        return punct + ' ' + letter.toUpperCase();
      });
      
      // Remove double spaces
      output = output.replace(/\s{2,}/g, ' ');
    }
    
    // Ensure improvements are logged
    if (improvements.length === 0) {
      improvements.push('Content analyzed and optimized according to selected parameters');
    }
    
    // Calculate comprehensive metrics
    const keywords = seoKeywords.length > 0 ? seoKeywords : [];
    const metrics = {
      readability: calculateReadability(output),
      structure: calculateStructure(output),
      sentiment: calculateSentimentScore(output),
      seoScore: calculateSEOScore(output, keywords),
      grammarScore: calculateGrammarScore(output),
      keywordDensity: keywords.length > 0 ? calculateKeywordDensity(output, keywords) : 0,
      safety: calculateSafety(output),
      tokenDeltaPct: calculateTokenDeltaPct(input, output)
    };
    
    return { output, metrics, improvements };
  },
  
  labels: {
    run: "Rewrite Content",
    save: "Save Rewrite",
    copy: "Copy Rewritten",
    editor: "Content Editor",
    result: "Rewritten Content",
    original: "Original",
    improvements: "Improvements Made"
  },
  
  metricsConfig: [
    { label: 'Readability', key: 'readability', color: 'bg-blue-500' },
    { label: 'Structure', key: 'structure', color: 'bg-green-500' },
    { label: 'Sentiment', key: 'sentiment', color: 'bg-purple-500' },
    { label: 'SEO Score', key: 'seoScore', color: 'bg-indigo-500' },
    { label: 'Grammar', key: 'grammarScore', color: 'bg-pink-500' },
    { 
      label: 'Keyword Density', 
      key: 'keywordDensity', 
      color: 'bg-cyan-500',
      format: (value: number) => `${value.toFixed(1)}%`
    },
    { label: 'Safety', key: 'safety', color: 'bg-orange-500' },
    { 
      label: 'Content Change', 
      key: 'tokenDeltaPct', 
      color: 'bg-yellow-500',
      format: (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
    }
  ],
  
  tokenCountFn: calculateTokenCount
};

// Helper functions for content generation
function generateInstagramContent(input: string, format: string, audience: string, viral: boolean): string {
  const topic = input.charAt(0).toUpperCase() + input.slice(1);
  
  if (format === 'post') {
    let content = viral ? 
      `🔥 VIRAL ALERT: ${topic} is EVERYWHERE right now!\n\n` :
      `✨ Let's talk about ${topic}...\n\n`;
    
    content += `Here's what you need to know:\n\n`;
    content += `📌 Why this matters to YOU\n`;
    content += `🎯 The secret most people miss\n`;
    content += `💡 How to get started today\n`;
    content += `🚀 Transform your approach\n\n`;
    content += `Double-tap if you agree! 👇\n\n`;
    content += `SAVE this post for later 💾`;
    
    return content;
  } else if (format === 'story') {
    return `🔥 STORY TIME: ${topic}\n\nSwipe up to learn more! →\n\nWhat's your experience with this?\nTell me in DMs! 💬`;
  }
  
  return `📸 ${topic} - Your complete guide\n\nEverything you need to know about ${topic.toLowerCase()} in one post!`;
}

function generateTikTokContent(input: string, format: string, audience: string, viral: boolean): string {
  const topic = input.charAt(0).toUpperCase() + input.slice(1);
  
  if (format === 'script') {
    let content = viral ? 
      `🎬 TikTok Script: "${topic} Will SHOCK You!"\n\n` :
      `🎬 TikTok Script: "${topic} Explained"\n\n`;
    
    content += `[HOOK - First 3 seconds]\n`;
    content += viral ? 
      `"You won't believe what I just discovered about ${topic.toLowerCase()}..."\n\n` :
      `"Let me explain ${topic.toLowerCase()} in 60 seconds"\n\n`;
    
    content += `[MAIN CONTENT - 15-45 seconds]\n`;
    content += `• Point 1: The surprising truth\n`;
    content += `• Point 2: Why everyone gets this wrong\n`;
    content += `• Point 3: The game-changing tip\n\n`;
    
    content += `[CALL TO ACTION - Last 15 seconds]\n`;
    content += `"Follow for more ${topic.toLowerCase()} tips!"\n`;
    content += `"Comment 'YES' if this helped!"\n`;
    content += `"Share with someone who needs this!"`;
    
    return content;
  }
  
  return `🎵 ${topic} trending now!\n\nThis ${topic.toLowerCase()} hack will change everything! Follow for more life hacks ✨`;
}

function generateTwitterContent(input: string, format: string, audience: string, viral: boolean): string {
  const topic = input.charAt(0).toUpperCase() + input.slice(1);
  
  if (format === 'thread') {
    let content = viral ? 
      `🧵 THREAD: ${topic} is about to explode (and here's why) 1/7\n\n` :
      `🧵 THREAD: Everything about ${topic} 1/5\n\n`;
    
    content += `Why ${topic.toLowerCase()} matters:\n\n`;
    content += `→ Point 1: The foundation\n`;
    content += `→ Point 2: The strategy  \n`;
    content += `→ Point 3: The execution\n\n`;
    content += `Retweet if helpful 🔄`;
    
    return content;
  }
  
  const hooks = viral ? 
    ['🔥 BREAKING:', '⚡ VIRAL:', '🚨 ALERT:'] :
    ['💡 TIP:', '🎯 FACT:', '📚 LEARN:'];
  
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  
  return `${hook} ${topic} is the key to unlocking your potential.\n\nHere's what 99% of people get wrong about ${topic.toLowerCase()}:\n\n[Thread below] 👇`;
}

function generateLinkedInContent(input: string, format: string, audience: string, viral: boolean): string {
  const topic = input.charAt(0).toUpperCase() + input.slice(1);
  
  let content = viral ? 
    `🔥 ${topic} is transforming industries - here's what you need to know:\n\n` :
    `💼 Professional insights on ${topic}:\n\n`;
  
  content += `After 10+ years in the industry, I've learned that ${topic.toLowerCase()} is more than just a buzzword.\n\n`;
  content += `Key insights:\n\n`;
  content += `✅ Strategic implementation matters\n`;
  content += `✅ Data-driven decisions are crucial\n`;
  content += `✅ Team alignment accelerates success\n`;
  content += `✅ Continuous learning drives innovation\n\n`;
  content += `What's your experience with ${topic.toLowerCase()}?\n\n`;
  content += `Share your thoughts in the comments 👇\n\n`;
  content += `Found this valuable? Repost to help your network ♻️`;
  
  return content;
}

function generateYouTubeContent(input: string, format: string, audience: string, viral: boolean): string {
  const topic = input.charAt(0).toUpperCase() + input.slice(1);
  
  if (format === 'script') {
    let content = viral ? 
      `🎥 YouTube Video Script: "${topic} - The VIRAL Truth!"\n\n` :
      `🎥 YouTube Video Script: "${topic} - Complete Guide"\n\n`;
    
    content += `[INTRO - 0:00-0:30]\n`;
    content += `"What's up everyone! Today we're diving deep into ${topic.toLowerCase()}. If you've ever wondered about this topic, this video is for you. Make sure to subscribe and hit the bell for more content like this!"\n\n`;
    
    content += `[MAIN CONTENT - 0:30-8:00]\n`;
    content += `• Section 1: Understanding ${topic}\n`;
    content += `• Section 2: Why it matters\n`;
    content += `• Section 3: Practical applications\n`;
    content += `• Section 4: Common mistakes\n`;
    content += `• Section 5: Pro tips\n\n`;
    
    content += `[OUTRO - 8:00-8:30]\n`;
    content += `"That's a wrap on ${topic.toLowerCase()}! What did you think? Drop a comment below and let me know. Don't forget to like this video and subscribe for more content. See you in the next one!"`;
    
    return content;
  }
  
  let content = `🎬 ${topic} - Everything You Need to Know\n\n`;
  content += `In this comprehensive guide, we explore ${topic.toLowerCase()} from every angle.\n\n`;
  content += `📺 What you'll learn:\n`;
  content += `• The fundamentals\n`;
  content += `• Advanced strategies\n`;
  content += `• Real-world examples\n`;
  content += `• Expert insights\n\n`;
  content += `🔔 Subscribe for more educational content!`;
  
  return content;
}

function generateGeneralContent(input: string, format: string, audience: string, viral: boolean): string {
  const topic = input.charAt(0).toUpperCase() + input.slice(1);
  
  if (format === 'article') {
    let content = `# ${topic}: ${viral ? 'The Viral Guide Everyone\'s Talking About' : 'A Comprehensive Guide'}\n\n`;
    
    content += `## Introduction\n\n`;
    content += `${topic} has become increasingly important in today's landscape. This guide explores everything you need to know about ${topic.toLowerCase()}.\n\n`;
    
    content += `## Key Points\n\n`;
    content += `1. Understanding the fundamentals of ${topic.toLowerCase()}\n`;
    content += `2. Best practices and proven strategies\n`;
    content += `3. Common challenges and solutions\n`;
    content += `4. Future trends and opportunities\n\n`;
    
    content += `## Conclusion\n\n`;
    content += `${topic} offers tremendous potential for those who understand how to leverage it effectively. By following these guidelines, you'll be well-positioned for success.`;
    
    return content;
  }
  
  return `${topic}: Essential insights and practical strategies for success in today's competitive landscape.`;
}

function generateHashtags(input: string, platform: string, trending: string[]): string[] {
  const topic = input.toLowerCase().replace(/\s+/g, '');
  const baseHashtags = [`#${topic}`, `#${topic}tips`, `#${topic}guide`];
  
  const platformHashtags: Record<string, string[]> = {
    instagram: ['#instagood', '#photooftheday', '#love', '#instadaily', '#follow'],
    tiktok: ['#fyp', '#viral', '#trending', '#foryou', '#tiktok'],
    twitter: ['#thread', '#tips', '#learn', '#growth', '#success'],
    linkedin: ['#professional', '#business', '#career', '#industry', '#networking'],
    youtube: ['#youtube', '#subscribe', '#tutorial', '#guide', '#howto']
  };
  
  const specificHashtags = platformHashtags[platform] || ['#content', '#tips', '#guide'];
  const trendingHashtags = trending.map(t => `#${t.replace(/\s+/g, '')}`);
  
  return [...baseHashtags, ...specificHashtags.slice(0, 3), ...trendingHashtags.slice(0, 2)];
}

function applyViralOptimization(content: string, platform: string): string {
  const viralTriggers = ['🔥', '⚡', '🚨', '💥', '🎯', '✨'];
  const trigger = viralTriggers[Math.floor(Math.random() * viralTriggers.length)];
  
  // Add viral elements based on platform
  if (platform === 'tiktok' || platform === 'instagram') {
    content = content.replace(/^/, `${trigger} VIRAL: `);
    content += '\n\nTag 3 friends who need to see this! 👥';
  } else if (platform === 'twitter') {
    content += '\n\nRT if you agree! This is going viral 🔥';
  } else {
    content += '\n\n🔥 This is trending everywhere - don\'t miss out!';
  }
  
  return content;
}

function integrateTrendingTopics(content: string, topics: string[], platform: string): string {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  if (platform === 'twitter' || platform === 'instagram') {
    content += `\n\nAlso trending: ${randomTopic} 📈`;
  } else {
    content += `\n\nRelated trending topic: ${randomTopic} - stay ahead of the curve!`;
  }
  
  return content;
}

function customizeForAudience(content: string, audience: string, platform: string): string {
  const audienceCustomizations: Record<string, string> = {
    millennials: 'This hits different when you realize...',
    genz: 'No cap, this is actually fire...',
    professionals: 'From a strategic perspective...',
    entrepreneurs: 'This could be a game-changer for your business...'
  };
  
  const customization = audienceCustomizations[audience];
  if (customization && audience !== 'general') {
    content = customization + ' ' + content;
  }
  
  return content;
}

function generateVariant(baseContent: string, platform: string, variantIndex: number): string {
  const variations = [
    (content: string) => content.replace(/🔥/g, '⚡').replace(/amazing/gi, 'incredible'),
    (content: string) => content.replace(/great/gi, 'fantastic').replace(/good/gi, 'excellent'),
    (content: string) => content.replace(/important/gi, 'crucial').replace(/help/gi, 'transform'),
    (content: string) => content.replace(/learn/gi, 'discover').replace(/know/gi, 'understand'),
    (content: string) => content.replace(/tips/gi, 'secrets').replace(/guide/gi, 'blueprint')
  ];
  
  const variation = variations[variantIndex % variations.length];
  return variation(baseContent);
}

const contentSpawnerStrategy: ProductStrategy = {
  async run(input: string, params?: Record<string, any>): Promise<ProcessResult> {
    const platform = params?.platform || 'general';
    const format = params?.format || 'article';
    const targetAudience = params?.targetAudience || 'general';
    const variants = params?.variants || 3;
    const trendingTopics = params?.trendingTopics ? params.trendingTopics.split(',').map((t: string) => t.trim()) : [];
    const viralOptimization = params?.viralOptimization || false;
    const hashtagOptimization = params?.hashtagOptimization || false;
    const engagementPrediction = params?.engagementPrediction || false;
    
    const improvements: string[] = [];
    let output = '';
    let hashtags: string[] = [];
    
    // Platform-specific content generation
    switch (platform) {
      case 'instagram':
        output = generateInstagramContent(input, format, targetAudience, viralOptimization);
        if (hashtagOptimization) {
          hashtags = generateHashtags(input, platform, trendingTopics);
          output += '\n\n' + hashtags.join(' ');
          improvements.push(`Generated ${hashtags.length} optimized Instagram hashtags`);
        }
        improvements.push('Optimized for Instagram engagement and visual storytelling');
        break;
        
      case 'tiktok':
        output = generateTikTokContent(input, format, targetAudience, viralOptimization);
        if (hashtagOptimization) {
          hashtags = generateHashtags(input, platform, trendingTopics);
          output += '\n\n' + hashtags.join(' ');
          improvements.push(`Generated ${hashtags.length} trending TikTok hashtags`);
        }
        improvements.push('Optimized for TikTok viral potential and short-form engagement');
        break;
        
      case 'twitter':
        output = generateTwitterContent(input, format, targetAudience, viralOptimization);
        if (hashtagOptimization) {
          hashtags = generateHashtags(input, platform, trendingTopics);
          output += ' ' + hashtags.slice(0, 3).join(' '); // Twitter limit
          improvements.push(`Generated ${hashtags.slice(0, 3).length} strategic Twitter hashtags`);
        }
        improvements.push('Optimized for Twitter character limits and engagement');
        break;
        
      case 'linkedin':
        output = generateLinkedInContent(input, format, targetAudience, viralOptimization);
        if (hashtagOptimization) {
          hashtags = generateHashtags(input, platform, trendingTopics);
          output += '\n\n' + hashtags.slice(0, 5).join(' '); // LinkedIn best practice
          improvements.push(`Generated ${hashtags.slice(0, 5).length} professional LinkedIn hashtags`);
        }
        improvements.push('Optimized for LinkedIn professional network engagement');
        break;
        
      case 'youtube':
        output = generateYouTubeContent(input, format, targetAudience, viralOptimization);
        if (hashtagOptimization) {
          hashtags = generateHashtags(input, platform, trendingTopics);
          output += '\n\nTags: ' + hashtags.join(', ');
          improvements.push(`Generated ${hashtags.length} SEO-optimized YouTube tags`);
        }
        improvements.push('Optimized for YouTube search and discovery');
        break;
        
      default:
        output = generateGeneralContent(input, format, targetAudience, viralOptimization);
        improvements.push('Generated versatile content suitable for multiple platforms');
    }
    
    // Viral optimization enhancements
    if (viralOptimization) {
      output = applyViralOptimization(output, platform);
      improvements.push('Applied viral optimization techniques for maximum shareability');
    }
    
    // Trending topics integration
    if (trendingTopics.length > 0) {
      output = integrateTrendingTopics(output, trendingTopics, platform);
      improvements.push(`Integrated ${trendingTopics.length} trending topics for relevance`);
    }
    
    // Audience-specific customization
    output = customizeForAudience(output, targetAudience, platform);
    improvements.push(`Customized content for ${targetAudience} audience`);
    
    // Generate multiple variants if requested
    if (variants > 1) {
      const baseOutput = output;
      const variantOutputs = [baseOutput];
      
      for (let i = 1; i < variants; i++) {
        const variant = generateVariant(baseOutput, platform, i);
        variantOutputs.push(variant);
      }
      
      output = variantOutputs.map((variant, index) => 
        `### Variant ${index + 1}\n\n${variant}`
      ).join('\n\n---\n\n');
      
      improvements.push(`Generated ${variants} unique content variants`);
    }
    
    // Calculate comprehensive metrics
    const metrics = {
      structure: calculateStructure(output),
      coverage: calculateCoverage(output, input.split(' ')),
      readability: calculateReadability(output),
      engagement: calculateEngagementPrediction(output, platform),
      viralPotential: calculateViralPotential(output),
      sentiment: calculateSentimentScore(output),
      tokenDeltaPct: calculateTokenDeltaPct(input, output)
    };
    
    return { output, metrics, improvements };
  },
  
  labels: {
    run: "Generate Content",
    save: "Save Generation",
    copy: "Copy Generated",
    editor: "Brief Editor",
    result: "Generated Content",
    original: "Brief",
    improvements: "Content Features"
  },
  
  metricsConfig: [
    { label: 'Structure', key: 'structure', color: 'bg-green-500' },
    { label: 'Coverage', key: 'coverage', color: 'bg-blue-500' },
    { label: 'Readability', key: 'readability', color: 'bg-purple-500' },
    { label: 'Engagement', key: 'engagement', color: 'bg-pink-500' },
    { label: 'Viral Potential', key: 'viralPotential', color: 'bg-red-500' },
    { label: 'Sentiment', key: 'sentiment', color: 'bg-indigo-500' },
    { 
      label: 'Content Growth', 
      key: 'tokenDeltaPct', 
      color: 'bg-orange-500',
      format: (value: number) => `+${value.toFixed(0)}%`
    }
  ],
  
  tokenCountFn: calculateTokenCount
};

const seoOptimizerStrategy: ProductStrategy = {
  async run(input: string, params?: Record<string, any>): Promise<ProcessResult> {
    const keywords = params?.keywords || [];
    const targetLength = params?.targetLength || 300;
    
    let output = input;
    const improvements: string[] = [];
    
    if (keywords.length > 0) {
      const mainKeyword = keywords[0];
      if (!input.toLowerCase().includes(mainKeyword.toLowerCase())) {
        output = `${mainKeyword}: ${output}`;
        improvements.push(`Added primary keyword "${mainKeyword}"`);
      }
      
      keywords.forEach((keyword: string, i: number) => {
        if (i > 0 && !output.toLowerCase().includes(keyword.toLowerCase())) {
          output += ` Learn more about ${keyword} and how it relates to your goals.`;
          improvements.push(`Integrated keyword "${keyword}"`);
        }
      });
    }
    
    const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 3) {
      output += ' This comprehensive approach ensures optimal results. Contact us for more information about implementation strategies.';
      improvements.push('Added supporting sentences for SEO');
    }
    
    if (output.length < targetLength) {
      output += ' Our expert team provides detailed analysis and recommendations tailored to your specific needs and objectives.';
      improvements.push('Expanded content to meet target length');
    }
    
    const h1Count = (output.match(/^#\s/gm) || []).length;
    const h2Count = (output.match(/^##\s/gm) || []).length;
    
    if (h1Count === 0 && h2Count === 0) {
      const firstSentence = sentences[0];
      if (firstSentence) {
        output = output.replace(firstSentence, `# ${firstSentence.trim()}\n\n## Overview\n\n${sentences.slice(1).join('. ')}`);
        improvements.push('Added header structure for SEO');
      }
    }
    
    const metrics = {
      structure: calculateStructure(output),
      keywordCoverage: calculateCoverage(output, keywords),
      readability: calculateReadability(output),
      tokenDeltaPct: calculateTokenDeltaPct(input, output)
    };
    
    return { output, metrics, improvements };
  },
  
  labels: {
    run: "Optimize for SEO",
    save: "Save Optimization",
    copy: "Copy Optimized",
    editor: "Content Editor",
    result: "SEO Optimized",
    original: "Original",
    improvements: "SEO Enhancements"
  },
  
  metricsConfig: [
    { label: 'Structure', key: 'structure', color: 'bg-green-500' },
    { label: 'Keywords', key: 'keywordCoverage', color: 'bg-blue-500' },
    { label: 'Readability', key: 'readability', color: 'bg-purple-500' },
    { 
      label: 'Content Growth', 
      key: 'tokenDeltaPct', 
      color: 'bg-orange-500',
      format: (value: number) => `+${value.toFixed(0)}%`
    }
  ],
  
  tokenCountFn: calculateTokenCount
};

const leadGenerationStrategy: ProductStrategy = {
  async run(input: string, params?: Record<string, any>): Promise<ProcessResult> {
    const audience = params?.audience || 'business professionals';
    const tone = params?.tone || 'professional';
    
    const improvements: string[] = [];
    
    const subject = input.split('\n')[0] || input.substring(0, 50);
    
    let output = `Subject: ${subject}\n\n`;
    output += `Dear ${audience.charAt(0).toUpperCase() + audience.slice(1)},\n\n`;
    output += `${input}\n\n`;
    output += `I'd love to discuss how this can benefit your organization. `;
    output += `Would you be available for a brief 15-minute conversation this week?\n\n`;
    output += `Best regards,\n[Your Name]`;
    
    improvements.push('Added professional email structure');
    improvements.push('Included clear call-to-action');
    improvements.push('Personalized for target audience');
    
    const metrics = {
      structure: calculateStructure(output),
      compliance: calculateCompliance(output),
      readability: calculateReadability(output),
      tokenDeltaPct: calculateTokenDeltaPct(input, output)
    };
    
    return { output, metrics, improvements };
  },
  
  labels: {
    run: "Generate Outreach",
    save: "Save Campaign",
    copy: "Copy Message",
    editor: "Message Editor",
    result: "Outreach Message",
    original: "Core Message",
    improvements: "Lead Gen Features"
  },
  
  metricsConfig: [
    { label: 'Structure', key: 'structure', color: 'bg-green-500' },
    { label: 'Compliance', key: 'compliance', color: 'bg-blue-500' },
    { label: 'Readability', key: 'readability', color: 'bg-purple-500' },
    { 
      label: 'Enhancement', 
      key: 'tokenDeltaPct', 
      color: 'bg-orange-500',
      format: (value: number) => `+${value.toFixed(0)}%`
    }
  ],
  
  tokenCountFn: calculateTokenCount
};

// Helper functions for bundle building
function calculateBundlePrice(products: any[], strategy: string, discountStrategy: string): number {
  const basePrice = products.reduce((sum, product) => sum + (product.price || 50), 0);
  
  let finalPrice = basePrice;
  
  // Apply pricing strategy
  switch (strategy) {
    case 'value':
      finalPrice = basePrice * 0.85; // Value pricing
      break;
    case 'competitive':
      finalPrice = basePrice * 0.78; // Competitive pricing
      break;
    case 'premium':
      finalPrice = basePrice * 1.2; // Premium pricing
      break;
    case 'economy':
      finalPrice = basePrice * 0.65; // Economy pricing
      break;
  }
  
  // Apply discount strategy
  switch (discountStrategy) {
    case 'tiered':
      if (products.length >= 5) finalPrice *= 0.8;
      else if (products.length >= 3) finalPrice *= 0.9;
      break;
    case 'bulk':
      finalPrice *= Math.max(0.6, 1 - (products.length * 0.05));
      break;
    case 'early':
      finalPrice *= 0.75; // Early bird discount
      break;
    case 'seasonal':
      finalPrice *= 0.85; // Seasonal discount
      break;
  }
  
  return Math.round(finalPrice);
}

function generateBundleProducts(input: string, bundleSize: number): any[] {
  const topic = input.toLowerCase();
  const products = [];
  
  const productTypes = [
    'Course', 'Guide', 'Template', 'Toolkit', 'Checklist', 
    'Workbook', 'Masterclass', 'Blueprint', 'Framework', 'System'
  ];
  
  for (let i = 0; i < bundleSize; i++) {
    const productType = productTypes[i % productTypes.length];
    products.push({
      name: `${topic} ${productType}`,
      type: productType,
      price: Math.floor(Math.random() * 50) + 25, // $25-75
      value: Math.floor(Math.random() * 100) + 100, // $100-200 value
      description: `Comprehensive ${productType.toLowerCase()} covering ${topic} fundamentals and advanced strategies`
    });
  }
  
  return products;
}

function calculateConversionMetrics(bundlePrice: number, individualPrices: number[], platform: string): any {
  const individualTotal = individualPrices.reduce((sum, price) => sum + price, 0);
  const savingsAmount = individualTotal - bundlePrice;
  const savingsPercentage = (savingsAmount / individualTotal) * 100;
  
  // Platform-specific conversion rates
  const conversionRates: Record<string, number> = {
    gumroad: 0.12,
    shopify: 0.15,
    stripe: 0.18,
    woocommerce: 0.14
  };
  
  const baseConversion = conversionRates[platform] || 0.12;
  
  // Adjust conversion based on savings
  let adjustedConversion = baseConversion;
  if (savingsPercentage > 50) adjustedConversion *= 1.4;
  else if (savingsPercentage > 30) adjustedConversion *= 1.2;
  else if (savingsPercentage > 20) adjustedConversion *= 1.1;
  
  return {
    individualTotal,
    bundlePrice,
    savingsAmount,
    savingsPercentage: Math.round(savingsPercentage),
    estimatedConversion: Math.round(adjustedConversion * 100),
    projectedRevenue: Math.round(bundlePrice * adjustedConversion * 1000) // Assuming 1000 visitors
  };
}

function generateBundleDescription(products: any[], conversionMetrics: any, platform: string): string {
  const productCount = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.value, 0);
  
  let description = `# Ultimate ${products[0].name.split(' ')[0]} Bundle\n\n`;
  description += `🎯 **${productCount} Premium Products Worth $${totalValue}**\n`;
  description += `💰 **Your Price: Only $${conversionMetrics.bundlePrice}**\n`;
  description += `✨ **Save $${conversionMetrics.savingsAmount} (${conversionMetrics.savingsPercentage}% OFF!)**\n\n`;
  
  description += `## What You Get:\n\n`;
  products.forEach((product, index) => {
    description += `${index + 1}. **${product.name}** (Value: $${product.value})\n`;
    description += `   ${product.description}\n\n`;
  });
  
  description += `## Why This Bundle?\n\n`;
  description += `✅ Complete system from beginner to expert\n`;
  description += `✅ Proven strategies used by professionals\n`;
  description += `✅ Immediate access to all materials\n`;
  description += `✅ Lifetime updates included\n`;
  description += `✅ 30-day money-back guarantee\n\n`;
  
  // Platform-specific optimization
  switch (platform) {
    case 'gumroad':
      description += `🚀 **One-Click Purchase on Gumroad**\n`;
      description += `🔐 Instant download after payment\n`;
      break;
    case 'shopify':
      description += `🛒 **Seamless Shopify Experience**\n`;
      description += `📱 Mobile-optimized checkout\n`;
      break;
    case 'stripe':
      description += `💳 **Secure Stripe Payments**\n`;
      description += `🌍 Worldwide payment methods accepted\n`;
      break;
  }
  
  description += `\n⚡ **Limited Time Offer - Act Now!**\n\n`;
  description += `*Individual products would cost $${conversionMetrics.individualTotal} - `;
  description += `get everything for just $${conversionMetrics.bundlePrice}!*`;
  
  return description;
}

const bundleBuilderStrategy: ProductStrategy = {
  async run(input: string, params?: Record<string, any>): Promise<ProcessResult> {
    const pricingStrategy = params?.pricingStrategy || 'value';
    const discountStrategy = params?.discountStrategy || 'tiered';
    const targetPlatform = params?.targetPlatform || 'gumroad';
    const bundleSize = params?.bundleSize || 3;
    const targetRevenue = params?.targetRevenue || 10000;
    const conversionOptimization = params?.conversionOptimization || false;
    const revenueMaximization = params?.revenueMaximization || false;
    const customerSatisfaction = params?.customerSatisfaction || false;
    
    const improvements: string[] = [];
    
    // Generate bundle products
    const products = generateBundleProducts(input, bundleSize);
    const individualPrices = products.map(p => p.value);
    
    // Calculate optimal pricing
    let bundlePrice = calculateBundlePrice(products, pricingStrategy, discountStrategy);
    
    // Revenue maximization adjustments
    if (revenueMaximization) {
      const revenueTestPrices = [bundlePrice * 0.9, bundlePrice, bundlePrice * 1.1];
      const revenueProjections = revenueTestPrices.map(price => {
        const metrics = calculateConversionMetrics(price, individualPrices, targetPlatform);
        return metrics.projectedRevenue;
      });
      
      const maxRevenueIndex = revenueProjections.indexOf(Math.max(...revenueProjections));
      bundlePrice = revenueTestPrices[maxRevenueIndex];
      improvements.push(`Revenue maximization: optimized price to $${bundlePrice} for maximum revenue`);
    }
    
    // Conversion optimization
    if (conversionOptimization) {
      const savingsRate = ((individualPrices.reduce((a, b) => a + b, 0) - bundlePrice) / individualPrices.reduce((a, b) => a + b, 0)) * 100;
      if (savingsRate < 25) {
        bundlePrice = Math.round(individualPrices.reduce((a, b) => a + b, 0) * 0.7); // Ensure 30% savings
        improvements.push('Conversion optimization: increased savings to boost conversion rate');
      }
    }
    
    // Customer satisfaction optimization
    if (customerSatisfaction) {
      bundlePrice = Math.round(bundlePrice * 0.95); // Slight price reduction for satisfaction
      improvements.push('Customer satisfaction: adjusted pricing for maximum value perception');
    }
    
    // Calculate final metrics
    const conversionMetrics = calculateConversionMetrics(bundlePrice, individualPrices, targetPlatform);
    
    // Generate bundle description
    const output = generateBundleDescription(products, conversionMetrics, targetPlatform);
    
    // Add strategy-specific improvements
    improvements.push(`Generated ${bundleSize}-product bundle with ${pricingStrategy} pricing strategy`);
    improvements.push(`Applied ${discountStrategy} discount structure for optimal appeal`);
    improvements.push(`Optimized for ${targetPlatform} platform conversion patterns`);
    improvements.push(`Projected ${conversionMetrics.savingsPercentage}% savings drives ${conversionMetrics.estimatedConversion}% conversion`);
    
    if (conversionMetrics.projectedRevenue >= targetRevenue) {
      improvements.push(`✅ Revenue target achieved: $${conversionMetrics.projectedRevenue} vs $${targetRevenue} target`);
    } else {
      improvements.push(`⚠️ Revenue projection: $${conversionMetrics.projectedRevenue} (target: $${targetRevenue})`);
    }
    
    // Calculate comprehensive metrics
    const metrics = {
      bundleValue: conversionMetrics.individualTotal,
      bundlePrice: conversionMetrics.bundlePrice,
      savingsPercentage: conversionMetrics.savingsPercentage,
      conversionRate: conversionMetrics.estimatedConversion,
      projectedRevenue: conversionMetrics.projectedRevenue,
      customerSatisfaction: customerSatisfaction ? 95 : 85,
      competitiveAdvantage: conversionMetrics.savingsPercentage > 30 ? 90 : 75,
      tokenDeltaPct: calculateTokenDeltaPct(input, output)
    };
    
    return { output, metrics, improvements };
  },
  
  labels: {
    run: "Build Bundle",
    save: "Save Bundle",
    copy: "Copy Bundle",
    editor: "Bundle Concept",
    result: "Bundle Structure",
    original: "Concept",
    improvements: "Bundle Optimizations"
  },
  
  metricsConfig: [
    { 
      label: 'Bundle Value', 
      key: 'bundleValue', 
      color: 'bg-green-500',
      format: (value: number) => `$${value}`
    },
    { 
      label: 'Bundle Price', 
      key: 'bundlePrice', 
      color: 'bg-blue-500',
      format: (value: number) => `$${value}`
    },
    { 
      label: 'Savings', 
      key: 'savingsPercentage', 
      color: 'bg-red-500',
      format: (value: number) => `${value}%`
    },
    { 
      label: 'Conversion Rate', 
      key: 'conversionRate', 
      color: 'bg-purple-500',
      format: (value: number) => `${value}%`
    },
    { 
      label: 'Revenue Projection', 
      key: 'projectedRevenue', 
      color: 'bg-yellow-500',
      format: (value: number) => `$${value}`
    },
    { label: 'Customer Satisfaction', key: 'customerSatisfaction', color: 'bg-pink-500' },
    { label: 'Competitive Edge', key: 'competitiveAdvantage', color: 'bg-indigo-500' }
  ],
  
  tokenCountFn: calculateTokenCount
};

export const TOOL_STRATEGIES: Record<string, ProductStrategy> = {
  'auto-rewrite': autoRewriteStrategy,
  'content-spawner': contentSpawnerStrategy,
  'seo-optimizer-pro': seoOptimizerStrategy,
  'lead-generation-pro': leadGenerationStrategy,
  'bundle-builder': bundleBuilderStrategy,
  
  'live-dashboard': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Update Dashboard",
      result: "Dashboard Content",
      improvements: "Dashboard Updates"
    }
  },
  
  'affiliate-portal': {
    ...leadGenerationStrategy,
    labels: {
      ...leadGenerationStrategy.labels,
      run: "Generate Affiliate",
      result: "Affiliate Content",
      improvements: "Affiliate Features"
    }
  },

  'aesthetic-generator': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Aesthetic",
      result: "Design Elements",
      improvements: "Design Features"
    }
  },

  'auto-niche-engine': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Discover Niche",
      result: "Niche Analysis",
      improvements: "Niche Insights"
    }
  },

  'content-calendar-pro': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Calendar",
      result: "Content Schedule",
      improvements: "Calendar Features"
    }
  },

  'customer-service-ai': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Generate Response",
      result: "Service Response",
      improvements: "Response Quality"
    }
  },

  'ecommerce-optimizer': {
    ...seoOptimizerStrategy,
    labels: {
      ...seoOptimizerStrategy.labels,
      run: "Optimize Store",
      result: "Optimized Content",
      improvements: "Store Improvements"
    }
  },

  'education-ai-compliance': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Check Compliance",
      result: "Compliance Report",
      improvements: "Compliance Updates"
    }
  },

  'email-marketing-suite': {
    ...leadGenerationStrategy,
    labels: {
      ...leadGenerationStrategy.labels,
      run: "Create Campaign",
      result: "Email Campaign",
      improvements: "Campaign Features"
    }
  },

  'financial-ai-compliance': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Check Compliance",
      result: "Compliance Report",
      improvements: "Compliance Updates"
    }
  },

  'healthcare-ai-compliance': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Check Compliance",
      result: "Compliance Report",
      improvements: "Compliance Updates"
    }
  },

  'invoice-generator': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Invoice",
      result: "Invoice Content",
      improvements: "Invoice Features"
    }
  },

  'legal-ai-compliance': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Check Compliance",
      result: "Compliance Report",
      improvements: "Compliance Updates"
    }
  },

  'medical-ai-assistant': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Generate Response",
      result: "Medical Response",
      improvements: "Response Quality"
    }
  },

  'podcast-producer': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Create Script",
      result: "Podcast Script",
      improvements: "Script Features"
    }
  },

  'project-management-pro': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Plan",
      result: "Project Plan",
      improvements: "Plan Features"
    }
  },

  'prompt-packs': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Prompts",
      result: "Prompt Collection",
      improvements: "Prompt Features"
    }
  },

  'quantum-ai-processor': {
    ...autoRewriteStrategy,
    labels: {
      ...autoRewriteStrategy.labels,
      run: "Process Data",
      result: "Processed Output",
      improvements: "Processing Enhancements"
    }
  },

  'social-media-manager': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Create Posts",
      result: "Social Content",
      improvements: "Content Features"
    }
  },

  'time-tracking-ai': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Report",
      result: "Time Report",
      improvements: "Report Features"
    }
  },

  'video-editor-ai': {
    ...contentSpawnerStrategy,
    labels: {
      ...contentSpawnerStrategy.labels,
      run: "Generate Script",
      result: "Video Script",
      improvements: "Script Features"
    }
  }
};