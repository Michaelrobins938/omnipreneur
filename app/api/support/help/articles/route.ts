import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';
import { z } from 'zod';

const SearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  type: z.enum(['article', 'video', 'tutorial', 'faq']).optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0)
});

const getHandler = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query') || undefined;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') as any || undefined;
    const type = searchParams.get('type') as any || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For now, return mock data
    // In a real app, this would query a help articles database/CMS
    const mockArticles = [
      {
        id: '1',
        title: 'Getting Started with Omnipreneur AI',
        excerpt: 'Learn how to set up your account and create your first AI-generated content in minutes.',
        category: 'getting-started',
        tags: ['beginner', 'setup', 'account'],
        difficulty: 'beginner',
        estimatedReadTime: 8,
        views: 2543,
        helpfulVotes: 189,
        unhelpfulVotes: 12,
        lastUpdated: '2025-01-10T00:00:00Z',
        author: 'Support Team',
        type: 'tutorial',
        featured: true
      },
      {
        id: '2',
        title: 'Creating High-Quality Marketing Copy with AI',
        excerpt: 'Discover proven strategies for generating compelling marketing copy that converts.',
        category: 'content-generation',
        tags: ['marketing', 'copywriting', 'advanced'],
        difficulty: 'intermediate',
        estimatedReadTime: 12,
        views: 1876,
        helpfulVotes: 145,
        unhelpfulVotes: 8,
        lastUpdated: '2025-01-08T00:00:00Z',
        author: 'Marketing Team',
        type: 'article',
        featured: true
      },
      {
        id: '3',
        title: 'Managing Your Subscription and Billing',
        excerpt: 'Learn how to upgrade, downgrade, and manage your subscription settings.',
        category: 'account-billing',
        tags: ['billing', 'subscription', 'account'],
        difficulty: 'beginner',
        estimatedReadTime: 5,
        views: 1432,
        helpfulVotes: 98,
        unhelpfulVotes: 5,
        lastUpdated: '2025-01-05T00:00:00Z',
        author: 'Support Team',
        type: 'faq',
        featured: false
      }
    ];

    // Apply filters
    let filteredArticles = mockArticles;

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (category) {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }

    if (difficulty) {
      filteredArticles = filteredArticles.filter(article => article.difficulty === difficulty);
    }

    if (type) {
      filteredArticles = filteredArticles.filter(article => article.type === type);
    }

    // Apply pagination
    const total = filteredArticles.length;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        articles: paginatedArticles,
        total,
        hasMore: offset + paginatedArticles.length < total,
        categories: [
          { id: 'getting-started', name: 'Getting Started', count: 12 },
          { id: 'content-generation', name: 'Content Generation', count: 18 },
          { id: 'account-billing', name: 'Account & Billing', count: 8 },
          { id: 'templates-library', name: 'Templates & Library', count: 15 },
          { id: 'integrations', name: 'Integrations', count: 10 },
          { id: 'privacy-security', name: 'Privacy & Security', count: 6 }
        ]
      }
    });

  } catch (error: any) {
    console.error('Help articles search error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'SEARCH_ERROR', 
          message: 'Failed to search help articles' 
        } 
      },
      { status: 500 }
    );
  }
};

export const GET = withRateLimit(getHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 searches per minute
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `help-search:${ip}`;
  }
});