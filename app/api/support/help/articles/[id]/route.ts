import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';

/**
 * GET /api/support/help/articles/[id]
 * 
 * Get a specific help article
 */
export const GET = withRateLimit(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Mock article data - in real app, fetch from database/CMS
    const mockArticle = {
      id: '1',
      title: 'Getting Started with Omnipreneur AI',
      content: `
# Getting Started with Omnipreneur AI

Welcome to Omnipreneur AI! This comprehensive guide will help you get up and running with our platform in just a few minutes.

## What is Omnipreneur AI?

Omnipreneur AI is a powerful platform that uses artificial intelligence to help entrepreneurs and businesses create high-quality content, automate marketing tasks, and scale their operations efficiently.

## Setting Up Your Account

### Step 1: Create Your Account
1. Visit our registration page
2. Enter your email address and create a secure password
3. Verify your email address
4. Complete your profile information

### Step 2: Choose Your Plan
We offer several subscription plans to meet your needs:
- **Starter**: Perfect for individuals and small projects
- **Professional**: Ideal for growing businesses
- **Enterprise**: For large organizations with advanced needs

### Step 3: Complete Your Profile
Add the following information to personalize your experience:
- Company information
- Industry and niche
- Content preferences
- Integration requirements

## Your First Content Generation

### Using the AI Content Generator
1. Navigate to the Content Generator from your dashboard
2. Select the type of content you want to create
3. Provide context and requirements
4. Review and refine the generated content
5. Save to your content library

### Best Practices for AI Content
- **Be specific**: Provide clear, detailed prompts
- **Set context**: Include background information about your business
- **Review and edit**: AI-generated content should be reviewed before use
- **Iterate**: Don't be afraid to regenerate and refine

## Managing Your Content Library

Your content library is where all your generated content is stored and organized.

### Organizing Content
- Use folders to categorize content by type or project
- Add tags for easy searching
- Rate content to track what works best
- Create templates from your best-performing content

### Sharing and Collaboration
- Share content with team members
- Set permissions for different user roles
- Export content in various formats
- Integrate with your existing tools

## Getting Help

If you need assistance:
- Check our Help Center for detailed guides
- Contact our support team via chat or email
- Join our community forum for tips and discussions
- Schedule a demo for personalized assistance

## Next Steps

Now that you're set up, here are some recommended next steps:
1. Explore our template library
2. Set up integrations with your existing tools
3. Create your first content campaign
4. Invite team members to collaborate

Remember, our support team is here to help you succeed. Don't hesitate to reach out if you have questions!
      `,
      excerpt: 'Learn how to set up your account and create your first AI-generated content in minutes.',
      category: 'getting-started',
      tags: ['beginner', 'setup', 'account', 'tutorial'],
      difficulty: 'beginner',
      estimatedReadTime: 8,
      views: 2543,
      helpfulVotes: 189,
      unhelpfulVotes: 12,
      lastUpdated: '2025-01-10T00:00:00Z',
      author: 'Support Team',
      type: 'tutorial',
      relatedArticles: ['2', '3', '4']
    };

    if (id !== '1') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'ARTICLE_NOT_FOUND', 
            message: 'Help article not found' 
          } 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mockArticle
    });

  } catch (error: any) {
    console.error('Help article fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch help article' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 30 // 30 requests per minute
}, (req: NextRequest) => {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `help-article:${ip}`;
});