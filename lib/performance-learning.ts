import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PerformanceMetricData {
  userId: string;
  productId: string;
  contentId?: string;
  actionType: string;
  metricName: string;
  metricValue: number;
  benchmark?: number;
  metadata?: any;
  tags?: string[];
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
}

export interface UserPreferenceData {
  userId: string;
  category: string;
  key: string;
  value: string;
  confidence?: number;
  sourceData?: any;
  isExplicit?: boolean;
}

export interface LearningInsight {
  pattern: string;
  confidence: number;
  recommendation: string;
  data: any;
}

export interface PerformanceAnalysis {
  overallScore: number;
  topPerformingContent: Array<{
    id: string;
    title: string;
    score: number;
    metrics: Record<string, number>;
  }>;
  successPatterns: LearningInsight[];
  improvementAreas: LearningInsight[];
  personalizedRecommendations: string[];
}

export class PerformanceLearningService {
  /**
   * Track a performance metric
   */
  static async trackMetric(data: PerformanceMetricData) {
    try {
      const metric = await prisma.performanceMetric.create({
        data: {
          userId: data.userId,
          productId: data.productId,
          contentId: data.contentId,
          actionType: data.actionType,
          metricName: data.metricName,
          metricValue: data.metricValue,
          benchmark: data.benchmark,
          metadata: data.metadata,
          tags: data.tags || [],
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          revenue: data.revenue,
          measuredAt: new Date()
        }
      });

      // Trigger learning analysis if significant data
      await this.analyzeLearningOpportunity(data.userId, data.productId, data.actionType);

      return metric;
    } catch (error) {
      console.error('Error tracking performance metric:', error);
      throw new Error('Failed to track performance metric');
    }
  }

  /**
   * Learn user preference from behavior
   */
  static async learnUserPreference(data: UserPreferenceData) {
    try {
      const existingPreference = await prisma.userPreference.findUnique({
        where: {
          userId_category_key: {
            userId: data.userId,
            category: data.category,
            key: data.key
          }
        }
      });

      if (existingPreference) {
        // Update existing preference with weighted average
        const newConfidence = Math.min(
          existingPreference.confidence + (data.confidence || 0.1),
          1.0
        );
        
        const updatedPreference = await prisma.userPreference.update({
          where: {
            id: existingPreference.id
          },
          data: {
            value: data.value,
            confidence: newConfidence,
            usage_count: { increment: 1 },
            lastUsed: new Date(),
            sourceData: data.sourceData,
            updatedAt: new Date()
          }
        });

        return updatedPreference;
      } else {
        // Create new preference
        const preference = await prisma.userPreference.create({
          data: {
            userId: data.userId,
            category: data.category,
            key: data.key,
            value: data.value,
            confidence: data.confidence || 0.5,
            sourceData: data.sourceData,
            isExplicit: data.isExplicit || false,
            lastUsed: new Date()
          }
        });

        return preference;
      }
    } catch (error) {
      console.error('Error learning user preference:', error);
      throw new Error('Failed to learn user preference');
    }
  }

  /**
   * Get comprehensive performance analysis
   */
  static async getPerformanceAnalysis(userId: string, productId?: string): Promise<PerformanceAnalysis> {
    try {
      const whereClause: any = { userId };
      if (productId) {
        whereClause.productId = productId;
      }

      // Get performance metrics
      const metrics = await prisma.performanceMetric.findMany({
        where: whereClause,
        orderBy: { measuredAt: 'desc' },
        take: 1000 // Limit for performance
      });

      // Calculate overall performance score
      const overallScore = this.calculateOverallScore(metrics);

      // Identify top performing content
      const topPerformingContent = await this.getTopPerformingContent(userId, productId);

      // Analyze success patterns
      const successPatterns = await this.analyzeSuccessPatterns(userId, productId);

      // Identify improvement areas
      const improvementAreas = await this.identifyImprovementAreas(userId, productId);

      // Generate personalized recommendations
      const personalizedRecommendations = await this.generatePersonalizedRecommendations(
        userId, 
        productId
      );

      return {
        overallScore,
        topPerformingContent,
        successPatterns,
        improvementAreas,
        personalizedRecommendations
      };
    } catch (error) {
      console.error('Error getting performance analysis:', error);
      throw new Error('Failed to get performance analysis');
    }
  }

  /**
   * Get user preferences with confidence scores
   */
  static async getUserPreferences(userId: string, category?: string) {
    try {
      const whereClause: any = { userId, isActive: true };
      if (category) {
        whereClause.category = category;
      }

      const preferences = await prisma.userPreference.findMany({
        where: whereClause,
        orderBy: [
          { confidence: 'desc' },
          { usage_count: 'desc' }
        ]
      });

      // Group by category for easier consumption
      const groupedPreferences = preferences.reduce((acc, pref) => {
        if (!acc[pref.category]) {
          acc[pref.category] = [];
        }
        acc[pref.category].push({
          key: pref.key,
          value: pref.value,
          confidence: pref.confidence,
          usageCount: pref.usage_count,
          lastUsed: pref.lastUsed,
          isExplicit: pref.isExplicit
        });
        return acc;
      }, {} as Record<string, any[]>);

      return groupedPreferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('Failed to get user preferences');
    }
  }

  /**
   * Track content performance automatically
   */
  static async trackContentPerformance(
    userId: string,
    contentId: string,
    productId: string,
    performanceData: {
      engagementRate?: number;
      clickThroughRate?: number;
      conversionRate?: number;
      qualityScore?: number;
      userRating?: number;
      shareCount?: number;
      viewTime?: number;
    }
  ) {
    try {
      const metrics = [];

      // Track each available metric
      for (const [metricName, value] of Object.entries(performanceData)) {
        if (value !== undefined) {
          metrics.push(this.trackMetric({
            userId,
            productId,
            contentId,
            actionType: 'content_performance',
            metricName,
            metricValue: value
          }));
        }
      }

      await Promise.all(metrics);

      // Learn patterns from this performance data
      await this.learnFromContentPerformance(userId, contentId, performanceData);

      return { success: true };
    } catch (error) {
      console.error('Error tracking content performance:', error);
      throw new Error('Failed to track content performance');
    }
  }

  /**
   * Get performance trends over time
   */
  static async getPerformanceTrends(
    userId: string,
    productId?: string,
    metricName?: string,
    days: number = 30
  ) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const whereClause: any = {
        userId,
        measuredAt: { gte: startDate }
      };

      if (productId) whereClause.productId = productId;
      if (metricName) whereClause.metricName = metricName;

      const metrics = await prisma.performanceMetric.findMany({
        where: whereClause,
        orderBy: { measuredAt: 'asc' }
      });

      // Group by day and calculate daily averages
      const dailyData = metrics.reduce((acc, metric) => {
        const day = metric.measuredAt.toISOString().split('T')[0];
        if (!acc[day]) {
          acc[day] = { values: [], total: 0, count: 0 };
        }
        acc[day].values.push(metric.metricValue);
        acc[day].total += metric.metricValue;
        acc[day].count += 1;
        return acc;
      }, {} as Record<string, { values: number[]; total: number; count: number }>);

      // Calculate trends
      const trends = Object.entries(dailyData).map(([date, data]) => ({
        date,
        average: data.total / data.count,
        count: data.count,
        min: Math.min(...data.values),
        max: Math.max(...data.values)
      }));

      return trends;
    } catch (error) {
      console.error('Error getting performance trends:', error);
      throw new Error('Failed to get performance trends');
    }
  }

  /**
   * Get actionable insights and recommendations
   */
  static async getActionableInsights(userId: string, productId?: string) {
    try {
      const insights = [];

      // Get recent performance data
      const recentMetrics = await prisma.performanceMetric.findMany({
        where: {
          userId,
          productId: productId || undefined,
          measuredAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      });

      // Analyze patterns and generate insights
      const patterns = this.analyzeMetricPatterns(recentMetrics);
      
      for (const pattern of patterns) {
        insights.push({
          type: 'performance_pattern',
          title: pattern.title,
          description: pattern.description,
          confidence: pattern.confidence,
          actionItems: pattern.actionItems,
          data: pattern.data
        });
      }

      // Get user preferences for personalized insights
      const preferences = await this.getUserPreferences(userId);
      
      // Generate preference-based insights
      for (const [category, prefs] of Object.entries(preferences)) {
        const highConfidencePrefs = prefs.filter(p => p.confidence > 0.7);
        if (highConfidencePrefs.length > 0) {
          insights.push({
            type: 'preference_insight',
            title: `Strong ${category} preferences detected`,
            description: `You consistently prefer: ${highConfidencePrefs.map(p => p.value).join(', ')}`,
            confidence: Math.max(...highConfidencePrefs.map(p => p.confidence)),
            actionItems: [`Continue using ${category} preferences for better results`],
            data: { category, preferences: highConfidencePrefs }
          });
        }
      }

      return insights;
    } catch (error) {
      console.error('Error getting actionable insights:', error);
      throw new Error('Failed to get actionable insights');
    }
  }

  /**
   * Private helper methods
   */
  private static calculateOverallScore(metrics: any[]): number {
    if (metrics.length === 0) return 0;

    // Weight different metrics differently
    const weights = {
      'engagement_rate': 0.3,
      'conversion_rate': 0.4,
      'quality_score': 0.2,
      'user_rating': 0.1
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const metric of metrics) {
      const weight = weights[metric.metricName as keyof typeof weights] || 0.1;
      totalWeightedScore += metric.metricValue * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
  }

  private static async getTopPerformingContent(userId: string, productId?: string) {
    try {
      // This would typically join with content library
      // For now, return aggregated metrics by contentId
      const topContent = await prisma.performanceMetric.groupBy({
        by: ['contentId'],
        where: {
          userId,
          productId: productId || undefined,
          contentId: { not: null }
        },
        _avg: {
          metricValue: true
        },
        _count: {
          metricValue: true
        },
        orderBy: {
          _avg: {
            metricValue: 'desc'
          }
        },
        take: 10
      });

      return topContent.map(item => ({
        id: item.contentId!,
        title: `Content ${item.contentId}`, // Would fetch from content library
        score: item._avg.metricValue || 0,
        metrics: { averageScore: item._avg.metricValue, dataPoints: item._count.metricValue }
      }));
    } catch (error) {
      console.error('Error getting top performing content:', error);
      return [];
    }
  }

  private static async analyzeSuccessPatterns(userId: string, productId?: string): Promise<LearningInsight[]> {
    // Implement pattern analysis logic
    return [
      {
        pattern: 'High engagement on visual content',
        confidence: 0.85,
        recommendation: 'Include more visual elements in your content',
        data: { contentType: 'visual', avgEngagement: 0.45 }
      }
    ];
  }

  private static async identifyImprovementAreas(userId: string, productId?: string): Promise<LearningInsight[]> {
    // Implement improvement analysis logic
    return [
      {
        pattern: 'Low conversion on technical content',
        confidence: 0.72,
        recommendation: 'Simplify technical explanations and add more examples',
        data: { contentType: 'technical', avgConversion: 0.12 }
      }
    ];
  }

  private static async generatePersonalizedRecommendations(userId: string, productId?: string): Promise<string[]> {
    const recommendations: string[] = [];

    // Get user preferences
    const preferences = await this.getUserPreferences(userId);

    // Generate recommendations based on preferences and performance
    if (preferences['tone']?.some(p => p.value === 'professional' && p.confidence > 0.7)) {
      recommendations.push('Continue using a professional tone - it aligns with your successful content');
    }

    if (preferences['content_length']?.some(p => p.value === 'long-form' && p.confidence > 0.6)) {
      recommendations.push('Focus on long-form content - your audience engages more with detailed posts');
    }

    return recommendations;
  }

  private static async analyzeLearningOpportunity(userId: string, productId: string, actionType: string) {
    // Analyze if there are enough data points to learn patterns
    const recentMetrics = await prisma.performanceMetric.count({
      where: {
        userId,
        productId,
        actionType,
        measuredAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    // If enough data points, trigger pattern learning
    if (recentMetrics >= 10) {
      await this.learnPatternsFromMetrics(userId, productId, actionType);
    }
  }

  private static async learnPatternsFromMetrics(userId: string, productId: string, actionType: string) {
    // Implement pattern learning logic
    // This could involve statistical analysis, trend detection, etc.
    console.log('Learning patterns from metrics for user:', userId);
  }

  private static async learnFromContentPerformance(
    userId: string, 
    contentId: string, 
    performanceData: any
  ) {
    // Learn user preferences from successful content
    if (performanceData.engagementRate > 0.5) {
      // High engagement - learn what made this successful
      // This is a simplified example
      await this.learnUserPreference({
        userId,
        category: 'successful_patterns',
        key: 'high_engagement_content',
        value: contentId,
        confidence: performanceData.engagementRate,
        sourceData: performanceData,
        isExplicit: false
      });
    }
  }

  private static analyzeMetricPatterns(metrics: any[]) {
    const patterns = [];

    // Group metrics by type
    const metricsByType = metrics.reduce((acc, metric) => {
      if (!acc[metric.metricName]) {
        acc[metric.metricName] = [];
      }
      acc[metric.metricName].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    // Analyze each metric type
    for (const [metricName, metricData] of Object.entries(metricsByType)) {
      if (metricData.length < 5) continue; // Need enough data

      const values = metricData.map(m => m.metricValue);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const trend = this.calculateTrend(values);

      if (trend > 0.1) {
        patterns.push({
          title: `Improving ${metricName}`,
          description: `Your ${metricName} has been trending upward`,
          confidence: Math.min(trend, 1),
          actionItems: [`Continue current strategy for ${metricName}`],
          data: { metricName, average, trend }
        });
      } else if (trend < -0.1) {
        patterns.push({
          title: `Declining ${metricName}`,
          description: `Your ${metricName} has been trending downward`,
          confidence: Math.abs(trend),
          actionItems: [`Review and adjust strategy for ${metricName}`],
          data: { metricName, average, trend }
        });
      }
    }

    return patterns;
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = values.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0);
    const sumXX = values.reduce((sum, _, i) => sum + (i * i), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }
}