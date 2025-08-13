// lib/novus/limits.ts - Free tier limit checks
import { storage } from './storage';

/**
 * Check if user has reached free tier limits
 */
export async function checkFreeTierLimits(userId: string): Promise<{ 
  allowed: boolean; 
  remaining: number; 
  limit: number;
  message?: string;
}> {
  const usage = await storage.getUsage(userId);
  
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

/**
 * Consume a usage quota (decrement remaining count)
 */
export async function consumeQuota(userId: string): Promise<boolean> {
  const usage = await storage.getUsage(userId);
  
  if (usage.remaining <= 0) {
    return false;
  }
  
  // In a real implementation, this would be atomic
  // For file-based storage, we'll increment the usage count
  await storage.incrementUsage(userId);
  return true;
}

/**
 * Get user plan limits
 */
export function getPlanLimits(plan: string): { limit: number; templates: boolean; analytics: boolean } {
  switch (plan) {
    case 'FREE':
      return { limit: 5, templates: false, analytics: false };
    case 'NOVUS_PROTOCOL':
    case 'PRO':
      return { limit: -1, templates: true, analytics: true }; // unlimited
    case 'ENTERPRISE':
      return { limit: -1, templates: true, analytics: true }; // unlimited
    default:
      return { limit: 0, templates: false, analytics: false };
  }
}