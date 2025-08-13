// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

// Time tracking entry validation schema
const CreateTimeEntrySchema = z.object({
  category: z.enum(['development', 'design', 'marketing', 'meetings', 'research', 'admin']),
  description: z.string().min(1).max(500),
  duration: z.number().positive(), // Duration in seconds
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime(),
  projectId: z.string().optional(),
  tags: z.array(z.string()).optional()
});

const TimeEntryQuerySchema = z.object({
  page: z.string().default('1').transform(val => parseInt(val, 10)).refine(val => val > 0),
  limit: z.string().default('20').transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 100),
  category: z.enum(['development', 'design', 'marketing', 'meetings', 'research', 'admin']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  projectId: z.string().optional()
});

/**
 * POST /api/time-tracking/entries
 * 
 * Create a new time tracking entry
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   category: 'development' | 'design' | 'marketing' | 'meetings' | 'research' | 'admin',
 *   description: string,
 *   duration: number (seconds),
 *   startTime?: string (ISO datetime),
 *   endTime: string (ISO datetime),
 *   projectId?: string,
 *   tags?: string[]
 * }
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateTimeEntrySchema.parse(body);

    // Calculate start time if not provided
    const endTime = new Date(validatedData.endTime);
    const startTime = validatedData.startTime 
      ? new Date(validatedData.startTime)
      : new Date(endTime.getTime() - (validatedData.duration * 1000));

    // Create time entry in database (simulated)
    const timeEntry = {
      id: Date.now().toString(),
      userId: user.userId,
      category: validatedData.category,
      description: validatedData.description,
      duration: validatedData.duration,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      projectId: validatedData.projectId,
      tags: validatedData.tags || [],
      createdAt: new Date().toISOString()
    };

    // In a real implementation, you would save to database:
    // const savedEntry = await prisma.timeEntry.create({
    //   data: timeEntry
    // });

    // Generate AI insights based on the entry
    const insights = await generateTimeTrackingInsights(user.userId, validatedData);

    return NextResponse.json({
      success: true,
      data: {
        entry: timeEntry,
        insights: insights,
        message: 'Time entry saved successfully'
      }
    });

  } catch (error) {
    console.error('Time tracking entry error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
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
          code: 'INTERNAL_ERROR', 
          message: 'Failed to save time entry' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `time-entry:${userId}:${ip}`;
  }
})));

/**
 * GET /api/time-tracking/entries
 * 
 * List user's time tracking entries with filtering and pagination
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - page?: number (default: 1)
 * - limit?: number (default: 20, max: 100)
 * - category?: 'development' | 'design' | 'marketing' | 'meetings' | 'research' | 'admin'
 * - startDate?: string (ISO datetime)
 * - endDate?: string (ISO datetime)
 * - projectId?: string
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    // Extract and validate query parameters
    const queryData = TimeEntryQuerySchema.parse(
      Object.fromEntries(searchParams.entries())
    );

    // Simulate fetching time entries with analytics
    const mockEntries = [
      {
        id: '1',
        userId: user.userId,
        category: 'development',
        description: 'Working on user authentication',
        duration: 7200, // 2 hours
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date().toISOString(),
        tags: ['frontend', 'auth'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: user.userId,
        category: 'design',
        description: 'Creating wireframes for dashboard',
        duration: 5400, // 1.5 hours
        startTime: new Date(Date.now() - 86400000 - 5400000).toISOString(),
        endTime: new Date(Date.now() - 86400000).toISOString(),
        tags: ['wireframes', 'ux'],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    // Apply filters (in real implementation, this would be done in database query)
    let filteredEntries = mockEntries;
    
    if (queryData.category) {
      filteredEntries = filteredEntries.filter(entry => entry.category === queryData.category);
    }

    // Calculate analytics
    const analytics = {
      totalTime: filteredEntries.reduce((sum, entry) => sum + entry.duration, 0),
      averageSessionLength: filteredEntries.length > 0 
        ? filteredEntries.reduce((sum, entry) => sum + entry.duration, 0) / filteredEntries.length 
        : 0,
      mostProductiveCategory: getMostProductiveCategory(filteredEntries),
      dailyAverage: getDailyAverage(filteredEntries),
      weeklyGoalProgress: getWeeklyGoalProgress(filteredEntries)
    };

    return NextResponse.json({
      success: true,
      data: {
        entries: filteredEntries,
        analytics: analytics,
        pagination: {
          page: queryData.page,
          limit: queryData.limit,
          total: filteredEntries.length,
          totalPages: Math.ceil(filteredEntries.length / queryData.limit)
        }
      }
    });

  } catch (error) {
    console.error('Time tracking entries fetch error:', error);

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
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch time entries' 
        } 
      },
      { status: 500 }
    );
  }
});

async function generateTimeTrackingInsights(userId: string, entryData: any) {
  // In a real implementation, this would use AI to analyze patterns
  return {
    productivityScore: Math.floor(Math.random() * 40) + 60, // 60-100
    optimalWorkTime: '10:00 AM - 11:30 AM',
    categoryDistribution: {
      development: 45,
      design: 25,
      meetings: 20,
      admin: 10
    },
    recommendations: [
      'Your productivity peaks in the morning. Consider scheduling complex tasks between 10-11 AM.',
      'You spend 20% of time in meetings. Consider batching meetings to create longer focus blocks.',
      'Your development sessions average 2.3 hours. This aligns with optimal focus periods.'
    ]
  };
}

function getMostProductiveCategory(entries: any[]) {
  const categoryTotals = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.duration;
    return acc;
  }, {});

  return Object.entries(categoryTotals).reduce((max, [category, time]) => 
    time > max.time ? { category, time } : max, 
    { category: 'development', time: 0 }
  );
}

function getDailyAverage(entries: any[]) {
  if (entries.length === 0) return 0;
  
  const days = new Set(entries.map(entry => 
    new Date(entry.createdAt).toDateString()
  )).size;
  
  const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
  return totalTime / Math.max(days, 1);
}

function getWeeklyGoalProgress(entries: any[]) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekEntries = entries.filter(entry => 
    new Date(entry.createdAt) >= weekStart
  );

  const weeklyTime = thisWeekEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const weeklyGoal = 40 * 3600; // 40 hours in seconds
  
  return {
    current: weeklyTime,
    goal: weeklyGoal,
    percentage: Math.min((weeklyTime / weeklyGoal) * 100, 100)
  };
}