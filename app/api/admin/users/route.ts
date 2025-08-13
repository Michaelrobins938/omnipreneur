import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

/**
 * GET /api/admin/users
 * Get all users for admin management
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    });
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const plan = searchParams.get('plan');

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role && role !== 'all') {
      where.role = role;
    }

    if (plan && plan !== 'all') {
      where.subscription = {
        plan: plan
      };
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          subscription: {
            select: {
              plan: true,
              status: true
            }
          },
          usage: {
            select: {
              rewrites: true,
              contentPieces: true,
              bundles: true,
              affiliateLinks: true,
              aiRequestsUsed: true
            }
          },
          _count: {
            select: {
              aiRequests: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Format the response
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      onboardingCompleted: user.onboardingCompleted,
      subscription: user.subscription,
      usage: {
        aiRequests: user._count.aiRequests,
        rewrites: user.usage?.rewrites || 0,
        contentPieces: user.usage?.contentPieces || 0,
        bundles: user.usage?.bundles || 0,
        affiliateLinks: user.usage?.affiliateLinks || 0
      }
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch users' } },
      { status: 500 }
    );
  }
});