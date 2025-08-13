import { toolkitStorage } from './storage';

export async function checkFreeTierLimits(productId: string, userId: string): Promise<{ 
  allowed: boolean; 
  remaining: number; 
  limit: number;
  message?: string;
}> {
  const usage = await toolkitStorage.getUsage(productId, userId);
  
  if (usage.remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      limit: usage.limit,
      message: `You've reached your free tier limit of ${usage.limit} runs per day. Upgrade to Pro for unlimited access.`
    };
  }
  
  return {
    allowed: true,
    remaining: usage.remaining,
    limit: usage.limit
  };
}

export async function consumeQuota(productId: string, userId: string): Promise<boolean> {
  const usage = await toolkitStorage.getUsage(productId, userId);
  
  if (usage.remaining <= 0) {
    return false;
  }
  
  await toolkitStorage.incrementUsage(productId, userId);
  return true;
}

export function getPlanLimits(plan: string): { limit: number; templates: boolean; analytics: boolean } {
  switch (plan) {
    case 'FREE':
      return { limit: 5, templates: false, analytics: false };
    case 'PRO':
    case 'ENTERPRISE':
      return { limit: -1, templates: true, analytics: true };
    default:
      return { limit: 0, templates: false, analytics: false };
  }
}