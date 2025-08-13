import prisma from '@/lib/db';

export async function saveNovusUsage(params: {
  userId: string;
  inputPrompt: string;
  optimizedPrompts: Array<{ version: string; prompt: string; }>;
  analysis: any;
  settings: Record<string, unknown>;
  creditsUsed: number;
}) {
  const last = params.optimizedPrompts?.[0]?.prompt || '';

  const rewrite = await prisma.rewrite.create({
    data: {
      userId: params.userId,
      originalPrompt: params.inputPrompt,
      optimizedPrompt: last,
      style: String(params.settings?.['strategy'] ?? ''),
      format: String(params.settings?.['targetUseCase'] ?? ''),
      context: JSON.stringify(params.settings ?? {}),
      improvements: params.analysis as any
    }
  });

  await prisma.usage.upsert({
    where: { userId: params.userId },
    update: { rewrites: { increment: params.creditsUsed || 1 } },
    create: {
      userId: params.userId,
      rewrites: params.creditsUsed || 1,
      contentPieces: 0,
      bundles: 0,
      affiliateLinks: 0
    }
  });

  await prisma.event.create({
    data: {
      userId: params.userId,
      event: 'novus_optimized',
      metadata: JSON.stringify({
        optimizedCount: params.optimizedPrompts?.length || 0,
        creditsUsed: params.creditsUsed,
        settings: params.settings
      })
    }
  });

  return rewrite.id;
}

export async function getNovusHistory(userId: string, limit = 20) {
  const items = await prisma.rewrite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 100)
  });
  return items;
}

