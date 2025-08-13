// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { chatComplete } from '@/lib/ai/openai';
import { logAIRequest } from '@/lib/db';

const prisma = new PrismaClient();

export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Get user's usage and subscription data
    const usage = await prisma.usage.findUnique({
      where: { userId: user.userId }
    });

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.userId }
    });

    // LIGHTWEIGHT MODE: Use cached usage data instead of expensive counts
    const rewritesCount = usage?.rewrites || 0;
    const contentPiecesCount = usage?.contentPieces || 0;
    const bundlesCount = usage?.bundles || 0;
    const affiliateLinksCount = usage?.affiliateLinks || 0;

    // Calculate monthly usage percentage based on plan limits
    const planLimits = {
      'FREE': 100,
      'BASIC': 500,
      'PRO': 2000,
      'ENTERPRISE': 10000
    };

    const currentPlan = subscription?.plan || 'FREE';
    const totalUsage = (usage?.rewrites || 0) + (usage?.contentPieces || 0) + (usage?.bundles || 0) + (usage?.affiliateLinks || 0);
    const monthlyUsage = Math.min(Math.round((totalUsage / planLimits[currentPlan as keyof typeof planLimits]) * 100), 100);

    // LIGHTWEIGHT MODE: Use cached AI request data
    const aiRequestsCount = usage?.aiRequestsUsed || 0;
    
    const userData = await prisma.user.findUnique({ 
      where: { id: user.userId },
      select: { ai_credits_remaining: true }
    });

    const analytics = {
      totalRewrites: rewritesCount,
      totalContentPieces: contentPiecesCount,
      totalBundles: bundlesCount,
      totalAffiliateLinks: affiliateLinksCount,
      aiRequests: aiRequestsCount,
      aiCreditsRemaining: userData?.ai_credits_remaining ?? 1000,
      monthlyUsage,
      subscriptionStatus: subscription?.status || 'ACTIVE',
      plan: currentPlan
    };

    // Optional AI insights via query ?withInsights=true
    const url = new URL(request.url);
    const withInsights = (url.searchParams.get('withInsights') || 'false') === 'true';
    let insights: { highlights: string[]; risks: string[]; recommendations: string[] } | undefined;
    if (withInsights) {
      try {
        const t0 = Date.now();
        const prompt = `Analyze metrics: totalUsers=?, totalRevenue=?, conv=${analytics.totalRewrites + analytics.totalContentPieces + analytics.totalBundles + analytics.totalAffiliateLinks}, monthlyUsage=${analytics.monthlyUsage}%, plan=${analytics.plan}. Provide JSON keys highlights[], risks[], recommendations[].`;
        const resp = await chatComplete({ system: 'You are a SaaS analytics expert. Respond ONLY with compact JSON.', user: prompt, temperature: 0.2, maxTokens: 300 });
        insights = JSON.parse(resp || '{}');
        try {
          await logAIRequest({ userId: user.userId, productId: 'live-dashboard', modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini', processingTimeMs: Date.now() - t0, success: true, inputData: { monthlyUsage: analytics.monthlyUsage, plan: analytics.plan }, outputData: insights });
        } catch (_) {}
      } catch (_) {}
    }

    return NextResponse.json({ success: true, data: { ...analytics, insights } });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ANALYTICS_ERROR', message: 'Failed to retrieve analytics' } },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-dashboard:${userId}:${ip}`;
  }
}));