// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma, { logAIRequest } from '@/lib/db';
import { chatComplete } from '@/lib/ai/openai';
import { AffiliatePortalService } from '@/lib/ai/affiliate-portal-service';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { withCsrfProtection } from '@/lib/security/csrf';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rate-limit';

// Types
// AuthenticatedRequest is now imported from '@/lib/auth-middleware'

interface AffiliateLinkWhereClause {
  userId: string;
  linkId?: string;
}

interface ClickDetail {
  id: string;
  linkId: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  city?: string;
}

interface ConversionEvent {
  id: string;
  linkId: string;
  timestamp: Date;
  amount: number;
  currency: string;
  orderId?: string;
}

interface TimeSeriesDataPoint {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface AffiliateLinkSummary {
  id: string;
  linkId: string;
  originalUrl: string;
  affiliateUrl: string;
  campaignName: string | null;
  commissionRate: number;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: Date;
}

interface TopPerformer {
  linkId: string;
  campaignName?: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  commissionRate: number;
}

interface ExtendedAffiliateLinkSummary extends AffiliateLinkSummary {
  conversionRate?: number;
  averageCommission?: number;
  ctr?: number;
  performance?: 'excellent' | 'good' | 'average' | 'poor';
}

interface AnalyticsData {
  summary: {
    totalLinks: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    averageConversionRate: number;
    averageCommissionRate: number;
    averageRevenuePerClick: number;
    clickTrend: 'up' | 'down' | 'stable';
    topConvertingLink: string | null;
    bestPerformingCampaign: string | null;
  };
  timeframe: {
    start: string;
    end: string;
    period: string;
  };
  links: ExtendedAffiliateLinkSummary[];
  timeSeriesData: TimeSeriesDataPoint[];
  topPerformers: TopPerformer[];
  referrerAnalysis: { referrer: string; clicks: number }[];
  geoData: { countries: { country: string; clicks: number; conversions: number }[]; totalCountries: number };
  clickDetails: ClickDetail[];
  insights?: {
    keyFindings: string[];
    recommendations: string[];
    alerts?: { type: 'warning' | 'success' | 'info'; message: string }[];
  };
}

// Use shared Prisma client from lib/db

// Query validation schema
const AnalyticsQuerySchema = z.object({
  linkId: z.string().optional(),
  timeframe: z.enum(['24h', '7d', '30d', '90d', '1y']).default('30d'),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
  includeClickDetails: z.string().default('false').transform(val => val === 'true'),
  withInsights: z.string().default('false').transform(val => val === 'true'),
  format: z.enum(['json', 'csv']).default('json')
});

/**
 * GET /api/affiliate/analytics
 * 
 * Get comprehensive affiliate link analytics
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - linkId?: string (specific link, or all links if omitted)
 * - timeframe?: '24h' | '7d' | '30d' | '90d' | '1y' (default: '30d')
 * - groupBy?: 'day' | 'week' | 'month' (default: 'day')
 * - includeClickDetails?: boolean (default: false)
 * - format?: 'json' | 'csv' (default: 'json')
 */
export const GET = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as AuthenticatedRequest).user;
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const queryData = {
      linkId: searchParams.get('linkId'),
      timeframe: searchParams.get('timeframe') || '30d',
      groupBy: searchParams.get('groupBy') || 'day',
      includeClickDetails: searchParams.get('includeClickDetails') || 'false',
      format: searchParams.get('format') || 'json'
    };

    const validatedQuery = AnalyticsQuerySchema.parse(queryData);
    const { linkId, timeframe, groupBy, includeClickDetails, withInsights, format } = validatedQuery;

    // Calculate date range
    const endDate = new Date();
    const startDate = getStartDate(timeframe, endDate);

    // Build where clause for affiliate links
    const linkWhereClause: AffiliateLinkWhereClause = { userId: user.id };
    if (linkId) {
      linkWhereClause.linkId = linkId;
    }

    // Get affiliate links with basic stats
    const affiliateLinks = await prisma.affiliateLink.findMany({
      where: linkWhereClause,
      select: {
        id: true,
        linkId: true,
        originalUrl: true,
        affiliateUrl: true,
        campaignName: true,
        commissionRate: true,
        clicks: true,
        conversions: true,
        revenue: true,
        createdAt: true
      }
    });

    if (affiliateLinks.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          summary: getEmptyAnalytics(),
          timeframe: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            period: timeframe
          },
          links: [],
          timeSeriesData: [],
          topPerformers: [],
          referrerAnalysis: [],
          geoData: { countries: [], totalCountries: 0 },
          clickDetails: includeClickDetails ? [] : undefined
        }
      });
    }

    const linkIds = affiliateLinks.map(link => link.linkId);

    // Get time-series click data
    const clickData = await getTimeSeriesData(linkIds, startDate, endDate, groupBy);

    // Get click details if requested
    let clickDetails: ClickDetail[] = [];
    if (includeClickDetails) {
      clickDetails = await getClickDetails(linkIds, startDate, endDate);
    }

    // Calculate analytics
    const analytics = calculateAnalytics(affiliateLinks, clickData);

    // Get top performing links
    const topPerformers = getTopPerformers(affiliateLinks);

    // Get referrer analysis
    const referrerAnalysis = await getReferrerAnalysis(linkIds, startDate, endDate);

    // Get geographic data (if available from IP tracking)
    const geoData = await getGeographicData(linkIds, startDate, endDate);

    const responseData: AnalyticsData = {
      summary: { ...analytics, topConvertingLink: analytics.topConvertingLink ?? null },
      timeframe: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        period: timeframe
      },
      links: affiliateLinks.map(link => ({
        ...link,
        conversionRate: link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0,
        averageCommission: link.conversions > 0 ? link.revenue / link.conversions : 0,
        ctr: calculateCTR(link.clicks),
        performance: getPerformanceRating(link)
      })),
      timeSeriesData: clickData,
      topPerformers,
      referrerAnalysis,
      geoData,
      clickDetails: includeClickDetails ? clickDetails : []
    };

    // Optional AI insights (uses AI service; requires eligible subscription)
    if (withInsights) {
      try {
        const t0 = Date.now();
        // Check subscription entitlement for AI insights
        try {
          const userWithSubscription = await prisma.user.findUnique({
            where: { id: user.id },
            include: { subscription: true }
          });
          const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
          const allowedPlans = ['PRO', 'ENTERPRISE'];
          if (!allowedPlans.includes(userPlan as any)) {
            return NextResponse.json({
              success: false,
              error: {
                code: 'SUBSCRIPTION_REQUIRED',
                message: 'Affiliate Portal (or PRO/ENTERPRISE) subscription required for AI insights',
                upgradeUrl: '/products/affiliate-portal'
              }
            }, { status: 403 });
          }
        } catch (_) {
          // If subscription check fails, proceed without blocking but do not generate insights
          return NextResponse.json({ success: true, data: responseData });
        }

        // Build minimal input for AI service from totals
        const totals = responseData.summary;
        const clicksTotal = totals.totalClicks;
        const conversionsTotal = totals.totalConversions;
        const revenueTotal = totals.totalRevenue;

        const svc = new AffiliatePortalService();
        const periodDays: number = (timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365);
        const svcResult = await svc.processBasicAnalytics({
          clicks: clicksTotal,
          conversions: conversionsTotal,
          revenue: revenueTotal,
          periodDays
        });

        const insights = {
          keyFindings: [
            `CTR: ${svcResult.ctrPct.toFixed(2)}%`,
            `CR: ${svcResult.crPct.toFixed(2)}%`,
            `EPC: $${svcResult.epc.toFixed(2)}`
          ],
          recommendations: svcResult.insights.map(i => `${i.metric}: ${i.recommendation}`),
          alerts: [] as { type: 'warning' | 'success' | 'info'; message: string }[]
        };
        responseData.insights = insights;
        // best-effort log
        try {
          await logAIRequest({
            userId: user.id,
            productId: 'affiliate-portal',
            modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
            processingTimeMs: Date.now() - t0,
            success: true,
            inputData: { timeframe, groupBy, totals: responseData.summary },
            outputData: insights
          });
        } catch (_) {}
      } catch (_) {
        // Ignore insights failures
      }
    }

    // Return CSV format if requested
    if (format === 'csv') {
      const csv = convertToCSV(responseData as unknown as AnalyticsData);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="affiliate-analytics-${timeframe}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error: unknown) {
    console.error('Affiliate analytics error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
            details: error.issues 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'ANALYTICS_ERROR', 
          message: 'Failed to retrieve analytics data' 
        } 
      },
      { status: 500 }
    );
  }
  }, {
    limit: 60, // 60 requests per 5 minutes per user
    windowMs: 5 * 60 * 1000,
    key: (req: NextRequest) => {
      const user = (req as any).user?.userId || 'anonymous';
      const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
      return `affiliate-analytics:${user}:${ip}`;
    }
  })
  )
);

/**
 * GET /api/affiliate/analytics/[linkId]
 * 
 * Get detailed analytics for a specific affiliate link
 */
export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async function POST(request: NextRequest) {
      try {
        const user = (request as AuthenticatedRequest).user;
        
        // AI Insights on demand (POST)
        const body = await request.json();
        const InsightsSchema = z.object({
          clicks: z.number().int().nonnegative(),
          conversions: z.number().int().nonnegative(),
          revenue: z.number().min(0),
          periodDays: z.number().int().min(1).max(365).optional()
        });
        const validated = InsightsSchema.parse(body);

    // Subscription check for AI insights
    const userWithSubscription = await prisma.user.findUnique({ where: { id: user.id }, include: { subscription: true } });
    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    const allowedPlans = ['AFFILIATE_PORTAL', 'PRO', 'ENTERPRISE'];
    if (!allowedPlans.includes(userPlan as any)) {
      return NextResponse.json({ success: false, error: { code: 'SUBSCRIPTION_REQUIRED', message: 'Affiliate Portal (or PRO/ENTERPRISE) subscription required', upgradeUrl: '/products/affiliate-portal' } }, { status: 403 });
    }

    const t0 = Date.now();
    const svc = new AffiliatePortalService();
    const payload = {
      clicks: validated.clicks,
      conversions: validated.conversions,
      revenue: validated.revenue,
      ...(typeof validated.periodDays === 'number' ? { periodDays: validated.periodDays } : {})
    };
    const result = await svc.processBasicAnalytics(payload);

    // Persist AI request/output
    try {
      await logAIRequest({
        userId: user.id,
        productId: 'affiliate-portal',
        modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
        processingTimeMs: Date.now() - t0,
        success: true,
        inputData: validated,
        outputData: result
      });
    } catch (_) {}

    return NextResponse.json({ success: true, data: result });

  } catch (error: unknown) {
    console.error('Custom analytics error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
            details: error.issues 
          } 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CUSTOM_ANALYTICS_ERROR', 
          message: 'Failed to process custom analytics query' 
        } 
      },
      { status: 500 }
    );
  }
    }, {
      limit: 30, // 30 requests per 5 minutes per user for AI insights
      windowMs: 5 * 60 * 1000,
      key: (req: NextRequest) => {
        const user = (req as any).user?.userId || 'anonymous';
        const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
        return `affiliate-analytics-insights:${user}:${ip}`;
      }
    })
  )
);

/**
 * Helper functions
 */

function getStartDate(timeframe: string, endDate: Date): Date {
  const startDate = new Date(endDate);
  
  switch (timeframe) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }
  
  return startDate;
}

async function getTimeSeriesData(linkIds: string[], startDate: Date, endDate: Date, groupBy: string): Promise<TimeSeriesDataPoint[]> {
  // For now, we'll simulate time series data
  // In production, this would use a more sophisticated query with groupByClause
  const clickTracking = await prisma.clickTracking.findMany({
    where: {
      linkId: { in: linkIds },
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      timestamp: 'asc'
    }
  });

  // Group clicks by time period
  const grouped = groupClicksByPeriod(clickTracking, groupBy);
  return grouped;
}

function groupClicksByPeriod(clicks: { timestamp: Date | string }[], groupBy: string): TimeSeriesDataPoint[] {
  const grouped: { [key: string]: number } = {};
  
  clicks.forEach(click => {
    let key: string;
    const date = new Date(click.timestamp);
    
    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0] || '';
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0] || '';
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0] || '';
    }
    
    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, clicks]) => ({
    date,
    clicks,
    conversions: Math.floor(clicks * 0.02), // Simulated 2% conversion rate
    revenue: Math.floor(clicks * 0.02 * 50) // Simulated $50 per conversion
  }));
}

// Placeholder for future conversion-event enrichment; current analytics derive from link aggregates
async function getConversionEvents(_userId: string, _linkIds: string[], _startDate: Date, _endDate: Date): Promise<ConversionEvent[]> {
  return [];
}

async function getClickDetails(linkIds: string[], startDate: Date, endDate: Date): Promise<ClickDetail[]> {
  return await prisma.clickTracking.findMany({
    where: {
      linkId: { in: linkIds },
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 100 // Limit to recent 100 clicks
  }) as ClickDetail[];
}

function calculateAnalytics(links: AffiliateLinkSummary[], clickData: TimeSeriesDataPoint[]) {
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0);
  const totalRevenue = links.reduce((sum, link) => sum + link.revenue, 0);
  
  return {
    totalLinks: links.length,
    totalClicks,
    totalConversions,
    totalRevenue,
    averageConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    averageCommissionRate: links.reduce((sum, link) => sum + link.commissionRate, 0) / links.length,
    averageRevenuePerClick: totalClicks > 0 ? totalRevenue / totalClicks : 0,
    clickTrend: calculateTrend(clickData),
    topConvertingLink: links.sort((a, b) => b.conversions - a.conversions)[0]?.linkId,
    bestPerformingCampaign: getBestCampaign(links)
  };
}

function getTopPerformers(links: AffiliateLinkSummary[]): TopPerformer[] {
  return links
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(link => ({
      linkId: link.linkId,
      campaignName: link.campaignName || '',
      clicks: link.clicks,
      conversions: link.conversions,
      revenue: link.revenue,
      conversionRate: link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0,
      commissionRate: link.commissionRate
    }));
}

async function getReferrerAnalysis(linkIds: string[], startDate: Date, endDate: Date): Promise<{ referrer: string; clicks: number }[]> {
  const clicks = await prisma.clickTracking.findMany({
    where: {
      linkId: { in: linkIds },
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      referrer: true
    }
  });

  const referrerCounts: { [key: string]: number } = {};
  clicks.forEach(click => {
    const domain = extractDomain(click.referrer || 'direct');
    referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
  });

  return Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([referrer, clicks]) => ({ referrer, clicks }));
}

async function getGeographicData(linkIds: string[], startDate: Date, endDate: Date): Promise<{ countries: { country: string; clicks: number; conversions: number }[]; totalCountries: number }> {
  // Placeholder for geographic analysis
  // In production, this would use IP geolocation
  return {
    countries: [
      { country: 'US', clicks: 150, conversions: 8 },
      { country: 'UK', clicks: 89, conversions: 4 },
      { country: 'CA', clicks: 67, conversions: 3 },
      { country: 'AU', clicks: 45, conversions: 2 }
    ],
    totalCountries: 12
  };
}

function calculateCTR(clicks: number): number {
  const impressions = clicks * 10; // Simulated impressions
  return impressions > 0 ? (clicks / impressions) * 100 : 0;
}

function getPerformanceRating(link: { clicks: number; conversions: number }): 'excellent' | 'good' | 'average' | 'poor' {
  const conversionRate = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;
  
  if (conversionRate >= 5) return 'excellent';
  if (conversionRate >= 2) return 'good';
  if (conversionRate >= 0.5) return 'average';
  return 'poor';
}

function calculateTrend(timeSeriesData: TimeSeriesDataPoint[]): 'up' | 'down' | 'stable' {
  if (timeSeriesData.length < 2) return 'stable';
  
  const recent = timeSeriesData.slice(-3).reduce((sum, data) => sum + data.clicks, 0);
  const previous = timeSeriesData.slice(-6, -3).reduce((sum, data) => sum + data.clicks, 0);
  
  if (recent > previous * 1.1) return 'up';
  if (recent < previous * 0.9) return 'down';
  return 'stable';
}

function getBestCampaign(links: AffiliateLinkSummary[]): string | null {
  const campaigns: { [key: string]: { revenue: number; clicks: number } } = {};
  
  links.forEach(link => {
    if (link.campaignName) {
      if (!campaigns[link.campaignName]) {
        campaigns[link.campaignName] = { revenue: 0, clicks: 0 };
      }
      campaigns[link.campaignName]!.revenue += link.revenue;
      campaigns[link.campaignName]!.clicks += link.clicks;
    }
  });
  
  const best = Object.entries(campaigns)
    .sort(([, a], [, b]) => b.revenue - a.revenue)[0];
  
  return best ? best[0] : null;
}

function extractDomain(url: string): string {
  if (!url || url === 'direct') return 'direct';
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

function getEmptyAnalytics(): AnalyticsData['summary'] {
  return {
    totalLinks: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    averageConversionRate: 0,
    averageCommissionRate: 0,
    averageRevenuePerClick: 0,
    clickTrend: 'stable' as const,
    topConvertingLink: null,
    bestPerformingCampaign: null
  };
}

function convertToCSV(data: AnalyticsData): string {
  const headers = ['Link ID', 'Campaign', 'Clicks', 'Conversions', 'Revenue', 'Conversion Rate', 'Commission Rate'];
  const rows = data.links.map((link) => [
    link.linkId,
    link.campaignName || '',
    link.clicks,
    link.conversions,
    link.revenue.toFixed(2),
    (link.conversionRate || 0).toFixed(2) + '%',
    (link.commissionRate * 100).toFixed(1) + '%'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map((field: string | number) => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

async function generateAffiliateInsights(data: AnalyticsData): Promise<{ keyFindings: string[]; recommendations: string[]; alerts?: { type: 'warning' | 'success' | 'info'; message: string }[]; }> {
  const summary = data.summary;
  const top = data.topPerformers?.[0];
  const prompt = `Analyze affiliate performance.
Totals: clicks=${summary.totalClicks}, conversions=${summary.totalConversions}, revenue=${summary.totalRevenue}, avgCR=${summary.averageConversionRate.toFixed(2)}%.
Top performer: ${top ? `${top.linkId} (CR=${top.conversionRate.toFixed(2)}%, revenue=${top.revenue})` : 'none'}.
Provide 3-5 key findings and 3-5 concrete recommendations. Return JSON {"keyFindings":[],"recommendations":[],"alerts":[{"type":"warning|success|info","message":"..."}...]}.`;
  try {
    const content = await chatComplete({ system: 'You analyze marketing data. Respond ONLY with compact JSON.', user: prompt, temperature: 0.2, maxTokens: 400 });
    const parsed = JSON.parse(content || '{}');
    if (Array.isArray(parsed.keyFindings) && Array.isArray(parsed.recommendations)) return parsed;
  } catch (_) {}
  // Fallback
  return {
    keyFindings: [
      'Clicks are concentrated in top 1-2 links',
      'Conversion rate within expected range for niche',
      'Revenue skewed by a small number of conversions'
    ],
    recommendations: [
      'Scale traffic to top-performing referrers',
      'A/B test landing copy for lowest-CR links',
      'Increase commission on high-margin campaigns'
    ],
    alerts: []
  };
}