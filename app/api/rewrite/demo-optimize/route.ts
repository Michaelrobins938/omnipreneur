// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

// Demo rewrite optimizations - realistic text transformations
const demoRewriteOptimizations = {
  'our company provides innovative solutions for businesses looking to improve their productivity and efficiency through advanced technology and strategic consulting services.': {
    professional: {
      rewrittenText: `We empower businesses to achieve peak productivity and operational efficiency through cutting-edge technology solutions and expert strategic consulting. Our comprehensive approach transforms how organizations operate, delivering measurable results that drive sustainable growth and competitive advantage in today's dynamic marketplace.`,
      improvements: [
        'Enhanced opening with action-oriented "We empower" instead of passive "Our company provides"',
        'Upgraded "innovative" to more specific "cutting-edge technology solutions"', 
        'Added concrete benefits: "measurable results" and "sustainable growth"',
        'Incorporated competitive positioning with "competitive advantage"',
        'Improved flow and readability while maintaining professional tone',
        'Expanded context with "today\'s dynamic marketplace" for relevance',
        'Strengthened word choice throughout for greater impact'
      ],
      analysis: {
        originalLength: 21,
        rewrittenLength: 39,
        improvementFactor: '2.3x more compelling',
        improvements: ['Action-oriented', 'Specific benefits', 'Competitive edge', 'Professional tone']
      }
    },
    conversational: {
      rewrittenText: `Hey there! We're all about helping businesses like yours work smarter, not harder. Through awesome tech and strategic know-how, we'll help you boost productivity, streamline operations, and actually see real results. Think of us as your behind-the-scenes team that makes everything run smoother so you can focus on what you do best.`,
      improvements: [
        'Opened with friendly "Hey there!" to establish conversational tone',
        'Used "we\'re all about" instead of formal "provides" for relatability',
        'Added "like yours" to create personal connection with reader',
        'Incorporated casual phrases: "work smarter, not harder" and "awesome tech"',
        'Used contractions naturally throughout for conversational flow',
        'Positioned company as supportive partner with "behind-the-scenes team"',
        'Ended with benefit-focused "what you do best" for emotional appeal'
      ],
      analysis: {
        originalLength: 21,
        rewrittenLength: 46,
        improvementFactor: '3.1x more engaging',
        improvements: ['Friendly tone', 'Personal connection', 'Casual language', 'Supportive positioning']
      }
    },
    persuasive: {
      rewrittenText: `Stop letting inefficient processes drain your profits. Smart businesses are already leveraging our proven technology solutions and strategic consulting to skyrocket their productivity by up to 300%. Don't get left behind while your competitors gain the upper hand. Join the industry leaders who trust us to transform their operations and unlock their true potential. The question isn't whether you can afford our services—it's whether you can afford to continue without them.`,
      improvements: [
        'Opened with compelling problem statement about profit drain',
        'Added social proof with "Smart businesses are already leveraging"',
        'Included specific quantifiable benefit: "up to 300%"',
        'Created urgency with "Don\'t get left behind" and competitor angle',
        'Used authority positioning with "industry leaders who trust us"',
        'Applied scarcity psychology throughout the messaging',
        'Ended with powerful reframe: "can you afford to continue without them"',
        'Incorporated emotional triggers and FOMO (fear of missing out)'
      ],
      analysis: {
        originalLength: 21,
        rewrittenLength: 65,
        improvementFactor: '4.2x more persuasive',
        improvements: ['Social proof', 'Urgency creation', 'Quantified benefits', 'Emotional triggers']
      }
    }
  },

  'we help customers achieve their goals through quality service.': {
    professional: {
      rewrittenText: `We partner with clients to deliver exceptional outcomes through our commitment to service excellence. Our tailored approach ensures that every engagement drives meaningful progress toward your strategic objectives, creating lasting value and sustainable success for your organization.`,
      improvements: [
        'Elevated "help customers" to more sophisticated "partner with clients"',
        'Replaced vague "achieve goals" with specific "deliver exceptional outcomes"',
        'Enhanced "quality service" to "service excellence" for premium positioning',
        'Added strategic depth with "strategic objectives" and "lasting value"',
        'Incorporated partnership language to build stronger relationships',
        'Improved sentence structure for better flow and readability'
      ],
      analysis: {
        originalLength: 9,
        rewrittenLength: 35,
        improvementFactor: '3.9x more comprehensive',
        improvements: ['Partnership focus', 'Outcome-driven', 'Strategic language', 'Value emphasis']
      }
    },
    conversational: {
      rewrittenText: `We're here to help you win! Whether you're trying to hit a big milestone or just want things to run better, we've got your back with awesome service that actually makes a difference. Think of us as your success team—we're not happy unless you're crushing your goals.`,
      improvements: [
        'Started with energetic "We\'re here to help you win!" for motivation',
        'Used relatable language: "hit a big milestone" and "things to run better"',
        'Added personality with "we\'ve got your back" for support feeling',
        'Incorporated enthusiasm with "awesome service" and "actually makes a difference"',
        'Positioned as "success team" for partnership appeal',
        'Ended with commitment-focused "not happy unless you\'re crushing"'
      ],
      analysis: {
        originalLength: 9,
        rewrittenLength: 40,
        improvementFactor: '4.4x more engaging',
        improvements: ['Motivational tone', 'Supportive language', 'Team positioning', 'Enthusiasm']
      }
    }
  }
};

// Default fallback rewrite generation
function generateGenericRewrite(originalText: string, style: string, audience: string) {
  const wordCount = originalText.split(' ').length;
  
  let rewrittenText = '';
  let improvements = [];
  
  switch (style) {
    case 'professional':
      rewrittenText = originalText
        .replace(/our company/gi, 'Our organization')
        .replace(/we help/gi, 'We enable') 
        .replace(/provides/gi, 'delivers')
        .replace(/innovative/gi, 'industry-leading')
        .replace(/solutions/gi, 'comprehensive solutions');
      
      improvements = [
        'Elevated language to professional standards',
        'Enhanced credibility with industry-specific terminology',
        'Improved corporate positioning and authority',
        'Strengthened value proposition clarity'
      ];
      break;
      
    case 'conversational':
      rewrittenText = originalText
        .replace(/Our company/gi, 'We')
        .replace(/provides/gi, 'offer')
        .replace(/through/gi, 'with')
        .replace(/solutions/gi, 'ways to help')
        .replace(/customers/gi, 'folks like you');
      
      improvements = [
        'Simplified language for better accessibility',
        'Added personal connection with "folks like you"',
        'Reduced formality while maintaining clarity',
        'Improved approachability and relatability'
      ];
      break;
      
    case 'persuasive':
      rewrittenText = `Don't settle for ordinary results. ${originalText.replace(/Our company provides/gi, 'Smart businesses choose our proven')} Join the leaders who are already seeing breakthrough results.`;
      
      improvements = [
        'Added compelling opening with "Don\'t settle" hook',
        'Incorporated social proof with "Smart businesses choose"',
        'Created urgency with competitive positioning',
        'Enhanced with results-focused language'
      ];
      break;
      
    case 'technical':
      rewrittenText = originalText
        .replace(/innovative/gi, 'proprietary')
        .replace(/solutions/gi, 'systems')
        .replace(/through/gi, 'utilizing')
        .replace(/services/gi, 'methodologies');
      
      improvements = [
        'Applied technical terminology for expert audience',
        'Enhanced precision with industry-specific language',
        'Improved technical credibility and authority',
        'Optimized for technical decision-makers'
      ];
      break;
      
    case 'creative':
      rewrittenText = `🚀 ${originalText.replace(/Our company/gi, 'We\'re the team that')} ✨ Ready to transform your world?`;
      
      improvements = [
        'Added visual elements with strategic emoji use',
        'Injected personality and creative energy',
        'Enhanced engagement with playful tone',
        'Created memorable and shareable content'
      ];
      break;
      
    case 'simplified':
      const words = originalText.split(' ');
      const simplifiedWords = words.map(word => {
        if (word.includes('innovative')) return 'new';
        if (word.includes('efficiency')) return 'speed';
        if (word.includes('productivity')) return 'output';
        if (word.includes('strategic')) return 'smart';
        return word;
      });
      rewrittenText = simplifiedWords.join(' ');
      
      improvements = [
        'Reduced complexity for broader accessibility',
        'Simplified vocabulary while maintaining meaning',
        'Improved readability for general audiences',
        'Enhanced comprehension across education levels'
      ];
      break;
      
    default:
      rewrittenText = originalText;
      improvements = ['Basic rewrite applied'];
  }

  return {
    rewrittenText,
    improvements,
    analysis: {
      originalLength: wordCount,
      rewrittenLength: rewrittenText.split(' ').length,
      improvementFactor: `${(rewrittenText.length / originalText.length).toFixed(1)}x enhanced`,
      improvements: [style, 'Clarity', 'Engagement', 'Readability']
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const { originalText = '', style = 'professional', audience = 'business-professionals' } = await request.json();

    if (!originalText || typeof originalText !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_INPUT', message: 'Original text is required' } 
      }, { status: 400 });
    }

    const trimmedText = originalText.trim().toLowerCase();

    // Check for predefined demo optimizations
    const textMatch = demoRewriteOptimizations[trimmedText];
    if (textMatch && textMatch[style]) {
      return NextResponse.json({ success: true, data: textMatch[style] });
    }

    // Check for partial matches (first few words)
    for (const [key, value] of Object.entries(demoRewriteOptimizations)) {
      const keyWords = key.toLowerCase().split(' ').slice(0, 4);
      const inputWords = trimmedText.split(' ').slice(0, 4);
      const matchCount = keyWords.filter(word => inputWords.includes(word)).length;
      
      if (matchCount >= 3 && value[style]) {
        return NextResponse.json({ success: true, data: value[style] });
      }
    }

    // Generate custom rewrite
    const customRewrite = generateGenericRewrite(originalText, style, audience);
    return NextResponse.json({ success: true, data: customRewrite });

  } catch (error) {
    console.error('Rewrite demo optimize error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'DEMO_ERROR', message: 'Failed to process rewrite demo request' } 
    }, { status: 500 });
  }
}