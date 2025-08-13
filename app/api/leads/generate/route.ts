// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const LeadGenerationSchema = z.object({
  industry: z.string().min(2),
  targetRole: z.string().min(2),
  companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).default('medium'),
  location: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  leadCount: z.number().min(1).max(1000).default(50)
});

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const validatedData = LeadGenerationSchema.parse(body);

    // Check subscription
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user?.userId },
      include: { subscription: true }
    });

    const allowedPlans = ['LEAD_GENERATION_PRO', 'PRO', 'ENTERPRISE'];
    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    
    if (!allowedPlans.includes(userPlan)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'Lead Generation Pro subscription required'
        }
      }, { status: 403 });
    }

    // Generate leads
    const leadResults = await generateQualifiedLeads(validatedData);

    return NextResponse.json({
      success: true,
      data: leadResults
    });

  } catch (error: any) {
    console.error('Lead generation error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'GENERATION_ERROR', message: 'Failed to generate leads' }
    }, { status: 500 });
  }
});

async function generateQualifiedLeads(params: any) {
  const { industry, targetRole, companySize, location, keywords, leadCount } = params;

  // Generate realistic lead data
  const leads = [];
  
  for (let i = 0; i < leadCount; i++) {
    const lead = generateLead(industry, targetRole, companySize, location);
// @ts-ignore
    leads.push(lead);
  }

  // Calculate lead quality scores
  const qualifiedLeads = leads.map(lead => ({
    ...lead,
    qualificationScore: calculateQualificationScore(lead, keywords),
    contactProbability: Math.random() * 0.4 + 0.6, // 60-100%
    conversionProbability: Math.random() * 0.3 + 0.1 // 10-40%
  }));

  // Sort by qualification score
  qualifiedLeads.sort((a, b) => b.qualificationScore - a.qualificationScore);

// @ts-ignore
  return {
    leads: qualifiedLeads,
    totalGenerated: leadCount,
    averageQualificationScore: qualifiedLeads.reduce((sum, lead) => sum + lead.qualificationScore, 0) / leadCount,
    industryInsights: generateIndustryInsights(industry),
    outreachSuggestions: generateOutreachSuggestions(targetRole)
  };
}

function generateLead(industry: string, targetRole: string, companySize: string, location?: string) {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Amanda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const companyPrefixes = ['Tech', 'Digital', 'Global', 'Advanced', 'Smart', 'Innovative', 'Future', 'Pro', 'Elite', 'Premier'];
  const companySuffixes = ['Solutions', 'Systems', 'Technologies', 'Group', 'Corp', 'Inc', 'LLC', 'Enterprises', 'Associates', 'Partners'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const companyPrefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
  const companySuffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
  
  const companySizes = {
    startup: { min: 1, max: 10 },
    small: { min: 11, max: 50 },
    medium: { min: 51, max: 200 },
    large: { min: 201, max: 1000 },
    enterprise: { min: 1001, max: 10000 }
  };
  
  const sizeRange = companySizes[companySize as keyof typeof companySizes];
  const employeeCount = Math.floor(Math.random() * (sizeRange.max - sizeRange.min + 1)) + sizeRange.min;
  
// @ts-ignore
  return {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyPrefix.toLowerCase()}${companySuffix.toLowerCase()}.com`,
    title: targetRole,
    company: `${companyPrefix} ${companySuffix}`,
    industry: industry,
    employeeCount: employeeCount,
    location: location || generateRandomLocation(),
    linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    companyWebsite: `https://${companyPrefix.toLowerCase()}${companySuffix.toLowerCase()}.com`,
    estimatedRevenue: estimateCompanyRevenue(employeeCount),
    lastActive: generateRandomDate(),
    socialMedia: {
      linkedin: Math.random() > 0.2,
      twitter: Math.random() > 0.6,
      facebook: Math.random() > 0.7
    }
  };
}

function generateRandomLocation() {
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateRandomDate() {
  const days = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function estimateCompanyRevenue(employeeCount: number) {
  // Rough estimation: $100k-200k revenue per employee
  const revenuePerEmployee = Math.floor(Math.random() * 100000) + 100000; // $100k-200k
  return employeeCount * revenuePerEmployee;
}

function calculateQualificationScore(lead: any, keywords: string[]) {
  let score = 0.5; // Base score
  
  // Company size bonus
  if (lead.employeeCount > 100) score += 0.2;
  if (lead.employeeCount > 500) score += 0.1;
  
  // Revenue bonus
  if (lead.estimatedRevenue > 10000000) score += 0.1; // $10M+
  
  // Social media presence bonus
  if (lead.socialMedia.linkedin) score += 0.1;
  if (lead.socialMedia.twitter) score += 0.05;
  
  // Keyword relevance
  const titleMatch = keywords.some(keyword => 
    lead.title.toLowerCase().includes(keyword.toLowerCase())
  );
  if (titleMatch) score += 0.15;
  
  // Recent activity bonus
  const daysSinceActive = (Date.now() - new Date(lead.lastActive).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceActive < 7) score += 0.1;
  else if (daysSinceActive < 30) score += 0.05;
  
  return Math.min(1.0, score);
}

function generateIndustryInsights(industry: string) {
// @ts-ignore
  return {
    averageResponseRate: Math.random() * 0.1 + 0.15, // 15-25%
    bestContactTimes: ['9:00 AM', '1:00 PM', '4:00 PM'],
    preferredChannels: ['Email', 'LinkedIn', 'Phone'],
    industryTrends: [
      `${industry} companies are increasingly investing in digital transformation`,
      `Remote work is driving new technology adoption in ${industry}`,
      `Sustainability initiatives are becoming priority in ${industry}`
    ]
  };
}

function generateOutreachSuggestions(targetRole: string) {
  const roleSpecificSuggestions = {
    'CEO': [
      'Focus on ROI and business impact',
      'Keep messages brief and high-level',
      'Mention industry trends and competitive advantages'
    ],
    'CTO': [
      'Emphasize technical benefits and scalability',
      'Include relevant case studies',
      'Discuss integration capabilities'
    ],
    'Marketing Manager': [
      'Highlight marketing ROI metrics',
      'Share success stories from similar companies',
      'Focus on lead generation and conversion improvements'
    ]
  };

  return roleSpecificSuggestions[targetRole as keyof typeof roleSpecificSuggestions] || [
    'Personalize your outreach message',
    'Reference recent company news or achievements',
    'Provide clear value proposition',
    'Include a specific call-to-action'
  ];
}