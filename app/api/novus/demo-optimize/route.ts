// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

// Demo optimization examples - realistic improvements without AI API calls
const demoOptimizations = {
  'Write a short post about morning routines.': {
    optimizedPrompt: `**CONTEXT & OBJECTIVE:**
Write an engaging 300-word social media post about morning routines that drives engagement and saves to user collections.

**TARGET AUDIENCE:** 
Health-conscious professionals aged 25-35 who struggle with productivity and work-life balance.

**TONE & STYLE:**
- Conversational and relatable
- Include personal storytelling elements
- Use action-oriented language
- Incorporate specific, actionable tips

**STRUCTURE REQUIREMENTS:**
1. Hook: Open with a relatable struggle or surprising statistic
2. Personal anecdote: Share a brief transformation story
3. Actionable advice: Provide 3-4 specific, implementable tips
4. Call-to-action: Encourage engagement (comments, shares, saves)

**SUCCESS METRICS:**
- Engagement rate >4%
- Save rate >2%
- Comments discussing personal routines

**EXAMPLE ELEMENTS TO INCLUDE:**
- Specific time frames ("5-minute meditation")
- Concrete benefits ("30% more energy")
- Visual cues ("phone in airplane mode")
- Community element ("What's your must-have morning ritual?")`,
    improvements: [
      'Added specific target audience definition for precise messaging',
      'Transformed vague "short post" into measurable 300-word constraint',
      'Included engagement metrics and success criteria',
      'Structured content with clear hierarchy and actionable framework',
      'Enhanced with psychological triggers (personal story, community engagement)',
      'Specified tone guidelines for consistent brand voice'
    ],
    analysis: {
      originalLength: 45,
      optimizedLength: 1247,
      improvementFactor: '27.7x more detailed',
      keyEnhancements: ['Audience targeting', 'Success metrics', 'Content structure', 'Engagement strategy']
    }
  },

  'Create a sales email.': {
    optimizedPrompt: `**EMAIL CAMPAIGN OBJECTIVE:**
Create a conversion-focused sales email for [PRODUCT/SERVICE] targeting [SPECIFIC AUDIENCE] with a goal of achieving >8% open rate and >2.5% click-through rate.

**AUDIENCE ANALYSIS:**
- Demographics: [Age, profession, income level]
- Pain points: [Primary frustrations they experience]
- Current solutions: [What they're using now that isn't working]
- Decision triggers: [What motivates them to buy]

**EMAIL STRUCTURE:**
1. **Subject Line Options** (A/B test ready):
   - Curiosity-driven: "The [solution] that [specific benefit]..."
   - Urgency-based: "Last chance: [specific offer] expires [date]"
   - Personal: "[Name], this might be exactly what you need"

2. **Opening (First 50 words):**
   - Address specific pain point immediately
   - Use "you" language for personalization
   - Include social proof or credibility indicator

3. **Value Proposition (Core message):**
   - Lead with transformation outcome, not features
   - Include specific, measurable benefits
   - Address top 2-3 objections preemptively

4. **Social Proof Section:**
   - Customer testimonial with specific results
   - Usage statistics or case study data
   - Industry recognition or expert endorsements

5. **Clear Call-to-Action:**
   - Single, prominent action button
   - Create urgency without false scarcity
   - Remove friction (one-click access)

**PSYCHOLOGICAL TRIGGERS:**
- Reciprocity: Provide valuable insight upfront
- Authority: Mention credentials or partnerships
- Scarcity: Limited-time offer or exclusive access
- Social proof: Customer success stories

**TECHNICAL SPECIFICATIONS:**
- Length: 150-200 words for mobile optimization
- Reading level: 8th grade for broad accessibility
- Preview text: Complement subject line, don't repeat
- Mobile-first formatting: Short paragraphs, bullet points

**SUCCESS METRICS:**
- Open rate: >8% (industry benchmark +2%)
- Click-through rate: >2.5%
- Conversion rate: >0.8%
- Unsubscribe rate: <0.5%`,
    improvements: [
      'Expanded generic "sales email" into comprehensive campaign strategy',
      'Added audience analysis framework for targeted messaging',
      'Included A/B testing options for subject lines',
      'Specified psychological triggers and persuasion techniques',
      'Added measurable success metrics and benchmarks',
      'Provided technical specifications for optimal deliverability',
      'Structured content hierarchy for maximum conversion impact'
    ],
    analysis: {
      originalLength: 21,
      optimizedLength: 1456,
      improvementFactor: '69.3x more comprehensive',
      keyEnhancements: ['Conversion strategy', 'Psychological triggers', 'A/B testing', 'Performance metrics']
    }
  },

  'Help me write better code comments.': {
    optimizedPrompt: `**CODE DOCUMENTATION ENHANCEMENT OBJECTIVE:**
Generate professional, maintainable code comments that follow industry best practices and improve code readability for team collaboration.

**COMMENT TYPES & STANDARDS:**

1. **Function/Method Documentation:**
   \`\`\`
   /**
    * @description [Clear, concise purpose explanation]
    * @param {type} paramName - [Parameter description with constraints]
    * @returns {type} [Return value description with possible states]
    * @throws {ErrorType} [When and why this error occurs]
    * @example
    * // Usage example with expected output
    * functionName(exampleInput) // => expectedOutput
    */
   \`\`\`

2. **Inline Comments Guidelines:**
   - Explain WHY, not WHAT the code does
   - Focus on business logic and complex algorithms
   - Flag temporary solutions with TODO/FIXME tags
   - Include links to relevant documentation or tickets

3. **File/Module Headers:**
   - Purpose and responsibility overview
   - Dependencies and integration points
   - Last modified date and author
   - Performance considerations or limitations

**QUALITY CRITERIA:**
- **Clarity**: Understandable by junior developers
- **Relevance**: Updates with code changes
- **Conciseness**: Essential information only
- **Accuracy**: Reflects current implementation

**SPECIFIC IMPROVEMENT AREAS:**
- Complex business logic explanations
- Algorithm time/space complexity notes
- Error handling and edge case documentation
- Integration points and data flow descriptions
- Performance optimization rationale

**CODE REVIEW CHECKLIST:**
□ Comments explain reasoning, not syntax
□ All public methods have complete documentation
□ Complex algorithms include efficiency notes
□ Error conditions are documented
□ External dependencies are explained
□ TODO items have assigned owners and dates

**TEAM STANDARDS:**
- Use consistent formatting across codebase
- Include code examples for complex functions
- Link to external documentation when relevant
- Update comments during refactoring
- Review comment quality during code reviews

**AUTOMATED TOOLS INTEGRATION:**
- JSDoc, Sphinx, or language-specific generators
- Linting rules for comment completeness
- Documentation coverage metrics
- Automated comment validation in CI/CD`,
    improvements: [
      'Transformed vague request into structured documentation strategy',
      'Added specific formatting standards and templates',
      'Included code review checklist for quality assurance',
      'Provided examples and implementation guidelines',
      'Added team collaboration and maintenance considerations',
      'Integrated automated tooling recommendations',
      'Created measurable quality criteria for consistent standards'
    ],
    analysis: {
      originalLength: 34,
      optimizedLength: 1289,
      improvementFactor: '37.9x more comprehensive',
      keyEnhancements: ['Documentation standards', 'Team collaboration', 'Quality metrics', 'Automation tools']
    }
  },

  'Plan a marketing campaign.': {
    optimizedPrompt: `**COMPREHENSIVE MARKETING CAMPAIGN STRATEGY:**

**CAMPAIGN FOUNDATION:**
- Product/Service: [Specify offering with unique value proposition]
- Campaign Goal: [Primary objective with measurable outcome]
- Budget Range: [Total budget and allocation breakdown]
- Timeline: [Campaign duration with key milestone dates]
- Geographic Scope: [Target markets and regional considerations]

**TARGET AUDIENCE ANALYSIS:**
1. **Primary Demographics:**
   - Age range, income level, education, profession
   - Geographic location and lifestyle preferences
   - Digital behavior and platform usage patterns

2. **Psychographic Profile:**
   - Values, interests, and motivational triggers
   - Pain points and challenges they face
   - Current solution gaps and unmet needs

3. **Customer Journey Mapping:**
   - Awareness stage touchpoints and content needs
   - Consideration phase decision factors
   - Purchase triggers and conversion catalysts
   - Post-purchase engagement and retention opportunities

**MULTI-CHANNEL STRATEGY:**
1. **Digital Channels:**
   - Social Media: Platform-specific content and advertising
   - Email Marketing: Segmented campaigns and automation
   - Content Marketing: Blog, video, podcast strategy
   - Paid Advertising: Google Ads, social media, display

2. **Traditional Channels:**
   - Print advertising placement and design
   - Radio/TV spots with optimal timing
   - Direct mail and promotional materials
   - Event marketing and sponsorship opportunities

**CONTENT STRATEGY & MESSAGING:**
- Core brand message and value proposition
- Platform-specific content adaptations
- Visual identity and creative guidelines
- Storytelling framework and narrative arc
- Call-to-action optimization for each touchpoint

**PERFORMANCE TRACKING:**
- KPI Dashboard: ROI, conversion rates, engagement metrics
- Attribution modeling across channels
- A/B testing protocols for continuous optimization
- Customer acquisition cost and lifetime value analysis
- Brand awareness and sentiment monitoring

**RISK MANAGEMENT:**
- Competitive response scenarios
- Budget reallocation strategies
- Crisis communication protocols
- Performance threshold triggers for campaign adjustments`,
    improvements: [
      'Transformed vague "plan campaign" into comprehensive strategic framework',
      'Added detailed audience analysis and customer journey mapping',
      'Included multi-channel approach with specific platform considerations',
      'Provided performance tracking and ROI measurement systems',
      'Added risk management and contingency planning elements',
      'Structured content strategy with brand consistency guidelines',
      'Enhanced with budget allocation and timeline management'
    ],
    analysis: {
      originalLength: 24,
      optimizedLength: 1789,
      improvementFactor: '74.5x more comprehensive',
      keyEnhancements: ['Strategic framework', 'Audience analysis', 'Multi-channel approach', 'Performance tracking']
    }
  }
};

// Default fallback for any other prompt
function generateGenericOptimization(originalPrompt: string) {
  const wordCount = originalPrompt.split(' ').length;
  const isShort = wordCount < 10;
  const isVague = !originalPrompt.includes('specific') && !originalPrompt.includes('detailed');
  
  let optimizedPrompt = `**ENHANCED PROMPT STRUCTURE:**

**OBJECTIVE:**
${originalPrompt.charAt(0).toUpperCase() + originalPrompt.slice(1)}

**CONTEXT & REQUIREMENTS:**
- Target audience: [Specify demographic, expertise level, interests]
- Purpose: [Define the exact goal and success criteria]
- Constraints: [Time, length, format, platform requirements]
- Style: [Tone, voice, formality level, brand guidelines]

**DETAILED SPECIFICATIONS:**
1. **Content Framework:**
   - Opening: [Hook, context setting, audience connection]
   - Body: [Main content structure with clear progression]
   - Conclusion: [Call-to-action, next steps, engagement prompt]

2. **Quality Standards:**
   - Clarity: [Specific readability and comprehension targets]
   - Accuracy: [Fact-checking and source requirements]
   - Engagement: [Interaction and response metrics]

3. **Success Metrics:**
   - Primary KPI: [Main measurement of success]
   - Secondary metrics: [Supporting performance indicators]
   - Timeline: [Deadline and milestone checkpoints]

**OUTPUT REQUIREMENTS:**
- Format: [Specific deliverable format and structure]
- Length: [Word count, character limits, time constraints]
- Review process: [Approval workflow and feedback integration]

**ADDITIONAL CONSIDERATIONS:**
- Accessibility requirements
- Platform-specific optimizations
- SEO or discoverability factors
- Legal or compliance requirements`;

  const improvements = [];
  
  if (isShort) {
    improvements.push('Expanded scope from basic request to comprehensive specification');
  }
  if (isVague) {
    improvements.push('Added specific targeting and success criteria');
  }
  improvements.push('Structured content with clear hierarchy and actionable framework');
  improvements.push('Included success metrics and quality standards');
  improvements.push('Added context and constraint specifications');
  improvements.push('Enhanced with professional formatting and review process');

  return {
    optimizedPrompt,
    improvements,
    analysis: {
      originalLength: originalPrompt.length,
      optimizedLength: optimizedPrompt.length,
      improvementFactor: `${Math.round((optimizedPrompt.length / originalPrompt.length) * 10) / 10}x more detailed`,
      keyEnhancements: ['Structure', 'Specificity', 'Success metrics', 'Quality standards']
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const { originalPrompt = '' } = await request.json();

    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_INPUT', message: 'originalPrompt is required' } 
      }, { status: 400 });
    }

    const trimmed = originalPrompt.trim().toLowerCase();

    // Check for predefined demo optimizations
    const exactMatch = demoOptimizations[originalPrompt.trim()];
    if (exactMatch) {
      return NextResponse.json({ success: true, data: exactMatch });
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(demoOptimizations)) {
      if (trimmed.includes(key.toLowerCase().split(' ')[0]) || 
          key.toLowerCase().includes(trimmed.split(' ')[0])) {
        return NextResponse.json({ success: true, data: value });
      }
    }

    // Generate custom optimization for any other prompt
    const customOptimization = generateGenericOptimization(originalPrompt);
    return NextResponse.json({ success: true, data: customOptimization });

  } catch (error) {
    console.error('Demo optimize error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'DEMO_ERROR', message: 'Failed to process demo request' } 
    }, { status: 500 });
  }
}

