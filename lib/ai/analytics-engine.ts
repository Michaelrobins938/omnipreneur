import prisma from '@/lib/db';
import { chatComplete } from '@/lib/ai/openai';
import { logAIRequest } from '@/lib/db';

export interface DashboardMetrics {
  revenue: {
    total: number;
    last30Days: number;
    trendPct: number;
  };
  content: {
    totalPieces: number;
    avgEngagementScore: number;
  };
  users: {
    eventsLast7Days: number;
  };
  products: {
    topProducts: Array<{ productId: string; usage: number }>;
    totalAIRequests: number;
  };
  affiliates: {
    totalLinks: number;
    totalClicks: number;
    conversionRate: number;
  };
}

export async function computeDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const [payments, contentPieces, recentEvents, aiRequests, affiliateData] = await Promise.all([
    prisma.payment.findMany({ where: { userId, status: 'SUCCEEDED' } }),
    prisma.contentPiece.findMany({ where: { userId } }),
    prisma.event.findMany({
      where: { userId, timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.aIRequest.groupBy({
      by: ['productId'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    }),
    prisma.affiliateLink.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { clicks: true, conversions: true }
    })
  ]);

  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const last30Days = payments
    .filter((p) => p.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((s, p) => s + (p.amount || 0), 0);

  // Simple trend: assume previous window similar size
  const prev30Days = payments
    .filter((p) => p.createdAt < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && p.createdAt >= new Date(Date.now() - 60 * 24 * 60 * 60 * 1000))
    .reduce((s, p) => s + (p.amount || 0), 0);
  const trendPct = prev30Days > 0 ? ((last30Days - prev30Days) / prev30Days) * 100 : 100;

  const totalPieces = contentPieces.length;
  // Approximate avg engagement if present in events metadata
  const engagementEvents = recentEvents.filter((e) => (e.metadata as any)?.engagementScore);
  const avgEngagementScore = engagementEvents.length
    ? engagementEvents.reduce((s, e) => s + Number((e.metadata as any)?.engagementScore || 0), 0) / engagementEvents.length
    : 0.75;

  const totalAIRequests = aiRequests.reduce((sum, req) => sum + req._count.id, 0);
  const conversionRate = affiliateData._sum.clicks ? 
    (affiliateData._sum.conversions || 0) / affiliateData._sum.clicks * 100 : 0;

  return {
    revenue: { total, last30Days, trendPct: Math.round(trendPct * 10) / 10 },
    content: { totalPieces, avgEngagementScore: Math.round(avgEngagementScore * 100) / 100 },
    users: { eventsLast7Days: recentEvents.length },
    products: {
      topProducts: aiRequests.map(req => ({ productId: req.productId, usage: req._count.id })),
      totalAIRequests
    },
    affiliates: {
      totalLinks: affiliateData._count.id || 0,
      totalClicks: affiliateData._sum.clicks || 0,
      conversionRate: Math.round(conversionRate * 100) / 100
    }
  };
}

export interface InsightItem {
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionableSteps?: string[];
  predictedOutcome?: string;
}

export async function generateInsights(userId: string): Promise<InsightItem[]> {
  const metrics = await computeDashboardMetrics(userId);
  const insights: InsightItem[] = [];
  
  // Generate basic rule-based insights first
  if (metrics.revenue.trendPct > 10) {
    insights.push({
      title: 'Revenue Growth Momentum',
      description: `Revenue grew ${metrics.revenue.trendPct}% vs prior 30 days. Strong performance indicates market validation.`,
      impact: 'high',
      actionableSteps: [
        'Increase ad spend by 15-20% to capture momentum',
        'Launch upsell campaigns to existing customers',
        'Create limited-time premium bundles'
      ],
      predictedOutcome: 'Additional 25-35% revenue growth potential'
    });
  } else if (metrics.revenue.trendPct < -10) {
    insights.push({
      title: 'Revenue Recovery Needed',
      description: `Revenue dropped ${Math.abs(metrics.revenue.trendPct)}% vs prior 30 days. Immediate action required.`,
      impact: 'high',
      actionableSteps: [
        'Survey recent churned customers for feedback',
        'Implement win-back email campaign with 20% discount',
        'Review and optimize pricing strategy',
        'Enhance product value proposition'
      ],
      predictedOutcome: 'Revenue stabilization within 2-3 weeks'
    });
  }

  if (metrics.content.totalPieces > 0 && metrics.content.avgEngagementScore < 0.7) {
    insights.push({
      title: 'Content Performance Optimization',
      description: 'Engagement rate is 30% below industry standard. Content strategy needs refinement.',
      impact: 'medium',
      actionableSteps: [
        'A/B test different content hooks and headlines',
        'Shift posting times to peak audience hours',
        'Incorporate more video and interactive content',
        'Add stronger CTAs in content'
      ],
      predictedOutcome: '40-50% engagement improvement expected'
    });
  }

  // Use AI to generate additional advanced insights
  try {
    const t0 = Date.now();
    const aiPrompt = `Analyze these business metrics and generate 2-3 advanced insights:
    
    Revenue: $${metrics.revenue.total.toLocaleString()} total, ${metrics.revenue.trendPct}% trend
    Content: ${metrics.content.totalPieces} pieces, ${metrics.content.avgEngagementScore} avg engagement
    Products: ${metrics.products.totalAIRequests} AI requests across ${metrics.products.topProducts.length} products
    Affiliates: ${metrics.affiliates.totalLinks} links, ${metrics.affiliates.conversionRate}% conversion rate
    Activity: ${metrics.users.eventsLast7Days} events in last 7 days
    
    Focus on: growth opportunities, risk mitigation, optimization strategies.
    Return as JSON array with: title, description, impact (low/medium/high), actionableSteps[], predictedOutcome`;

    const response = await chatComplete({
      system: 'You are a business analytics expert. Provide data-driven insights that are actionable and specific.',
      user: aiPrompt,
      temperature: 0.3,
      maxTokens: 800
    });

    if (response) {
      try {
        const aiInsights = JSON.parse(response);
        if (Array.isArray(aiInsights)) {
          insights.push(...aiInsights.slice(0, 3));
        }
      } catch (parseError) {
        console.error('Failed to parse AI insights:', parseError);
      }
    }

    await logAIRequest({
      userId,
      productId: 'analytics-insights',
      modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
      processingTimeMs: Date.now() - t0,
      success: true,
      inputData: { metrics },
      outputData: { insights }
    });
  } catch (error) {
    console.error('AI insights generation failed:', error);
  }

  // Always include optimization opportunities
  if (metrics.products.totalAIRequests > 0 && metrics.products.topProducts.length > 0) {
    const topProduct = metrics.products.topProducts[0];
    insights.push({
      title: 'Product Usage Optimization',
      description: `${topProduct.productId} accounts for ${Math.round(topProduct.usage / metrics.products.totalAIRequests * 100)}% of usage. Opportunity to expand feature adoption.`,
      impact: 'medium',
      actionableSteps: [
        'Create tutorial content for underutilized features',
        'Implement in-app guidance for new users',
        'Cross-promote complementary products'
      ],
      predictedOutcome: '20-30% increase in product diversity'
    });
  }

  return insights;
}

