import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Sanitize DATABASE_URL to avoid issues with quotes/newlines on Windows shell writes
function getSanitizedDatabaseUrl(): string | undefined {
  const raw = process.env['DATABASE_URL'];
  if (!raw) return undefined;
  // Trim whitespace and remove surrounding quotes if any
  const trimmed = raw.trim().replace(/^"|"$/g, '');
  // Collapse accidental newlines/spaces inserted by editors or shells
  const compact = trimmed.replace(/\r|\n/g, '').replace(/\s+/g, '');
  // Only return if it still looks like a Postgres URL
  if (compact.startsWith('postgresql://') || compact.startsWith('postgres://')) {
    return compact;
  }
  // Fallback to original if compacting removed required separators (should not happen)
  return raw;
}

const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getSanitizedDatabaseUrl() || '',
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;

// Database utility functions
export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        usage: true
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
        usage: true
      }
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  name: string;
  password: string;
}) {
  try {
    return await prisma.user.create({
      data: {
        ...userData,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE'
          }
        },
        usage: {
          create: {
            rewrites: 0,
            contentPieces: 0,
            bundles: 0,
            affiliateLinks: 0
          }
        }
      },
      include: {
        subscription: true,
        usage: true
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserSubscription(userId: string, data: {
  plan: string;
  status: string;
  stripeId?: string;
  currentPeriodEnd?: Date;
}) {
  try {
    return await prisma.subscription.upsert({
      where: { userId },
      update: {
        ...data,
  plan: data.plan as 'FREE' | 'PRO' | 'ENTERPRISE',
  status: data.status as unknown as 'ACTIVE' | 'PAST_DUE' | 'CANCELLED'
      },
      create: {
        userId,
        ...data,
  plan: data.plan as 'FREE' | 'PRO' | 'ENTERPRISE',
  status: data.status as unknown as 'ACTIVE' | 'PAST_DUE' | 'CANCELLED'
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function updateUsage(userId: string, feature: keyof Omit<{ userId: string; rewrites: number; contentPieces: number; bundles: number; affiliateLinks: number; }, 'userId'>) {
  try {
    const usage = await prisma.usage.findUnique({
      where: { userId }
    });

    if (!usage) {
      return await prisma.usage.create({
        data: {
          userId,
          [feature]: 1,
          rewrites: feature === 'rewrites' ? 1 : 0,
          contentPieces: feature === 'contentPieces' ? 1 : 0,
          bundles: feature === 'bundles' ? 1 : 0,
          affiliateLinks: feature === 'affiliateLinks' ? 1 : 0
        }
      });
    }

    return await prisma.usage.update({
      where: { userId },
      data: {
        [feature]: {
          increment: 1
        }
      }
    });
  } catch (error) {
    console.error('Error updating usage:', error);
    throw error;
  }
}

export async function saveRewrite(data: {
  userId: string;
  originalPrompt: string;
  optimizedPrompt: string;
  style?: string;
  format?: string;
  context?: string;
  improvements?: any;
}) {
  try {
    return await prisma.rewrite.create({
      data
    });
  } catch (error) {
    console.error('Error saving rewrite:', error);
    throw error;
  }
}

export async function saveContentPiece(data: {
  userId: string;
  niche: string;
  contentType: 'SOCIAL' | 'BLOG' | 'EMAIL' | 'VIDEO' | 'MIXED';
  tone: string;
  content: string;
  keywords: string[];
  targetAudience?: string;
}) {
  try {
    return await prisma.contentPiece.create({
      data
    });
  } catch (error) {
    console.error('Error saving content piece:', error);
    throw error;
  }
}

export async function saveBundle(data: {
  userId: string;
  name: string;
  price: number;
  bundleType: 'COURSE' | 'TEMPLATE' | 'TOOLKIT' | 'MASTERCLASS' | 'SOFTWARE';
  targetAudience: string;
  description?: string;
  products: string[];
  pricingStrategy?: string;
  bundleData: any;
  salesCopy?: any;
  marketingMaterials?: any;
}) {
  try {
    return await prisma.bundle.create({
      data
    });
  } catch (error) {
    console.error('Error saving bundle:', error);
    throw error;
  }
}

export async function saveAffiliateLink(data: {
  userId: string;
  linkId: string;
  originalUrl: string;
  affiliateUrl: string;
  campaignName?: string;
  commissionRate: number;
  optimizationData?: any;
}) {
  try {
    return await prisma.affiliateLink.create({
      data
    });
  } catch (error) {
    console.error('Error saving affiliate link:', error);
    throw error;
  }
}

export async function savePayment(data: {
  userId: string;
  stripeId: string;
  amount: number;
  currency?: string;
  status: string;
  plan?: string;
  productName?: string;
  metadata?: any;
}) {
  try {
    return await prisma.payment.create({
      data: {
        userId: data.userId,
        stripeId: data.stripeId,
        amount: data.amount,
        currency: data.currency,
        plan: data.plan as 'FREE' | 'PRO' | 'ENTERPRISE' | null,
        productName: data.productName || null,
        metadata: data.metadata || null,
        status: data.status as 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED'
      }
    });
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
}

export async function saveEvent(data: {
  userId: string;
  event: string;
  metadata?: any;
}) {
  try {
    return await prisma.event.create({
      data
    });
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
}

// AI request logging helpers
export async function logAIRequest(params: {
  userId: string;
  productId: string;
  modelUsed?: string;
  inputTokens?: number;
  outputTokens?: number;
  processingTimeMs?: number;
  success: boolean;
  inputData?: any;
  outputData?: any;
  qualityScore?: number;
}) {
  const request = await prisma.aIRequest.create({
    data: {
      userId: params.userId,
      productId: params.productId,
      modelUsed: params.modelUsed || null,
      inputTokens: params.inputTokens || null,
      outputTokens: params.outputTokens || null,
      processingTimeMs: params.processingTimeMs || null,
      success: params.success
    }
  });

  await prisma.aIOutput.create({
    data: {
      requestId: request.id,
      inputData: params.inputData ?? undefined,
      outputData: params.outputData ?? undefined,
      qualityScore: params.qualityScore || null
    }
  });

  // Increment usage counter
  await prisma.usage.upsert({
    where: { userId: params.userId },
    update: { aiRequestsUsed: { increment: 1 } },
    create: { userId: params.userId, aiRequestsUsed: 1, rewrites: 0, contentPieces: 0, bundles: 0, affiliateLinks: 0 }
  });

  return request.id;
}

export async function getUsageStats(userId: string) {
  try {
    const usage = await prisma.usage.findUnique({
      where: { userId }
    });

    const recentActivity = await prisma.event.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return {
      usage,
      recentActivity
    };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return null;
  }
}

export async function getUserHistory(userId: string) {
  try {
    const [rewrites, contentPieces, bundles, affiliateLinks] = await Promise.all([
      prisma.rewrite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.contentPiece.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.bundle.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.affiliateLink.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    return {
      rewrites,
      contentPieces,
      bundles,
      affiliateLinks
    };
  } catch (error) {
    console.error('Error fetching user history:', error);
    return null;
  }
} 