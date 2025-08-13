// lib/novus/metrics.ts - Metrics calculation utilities
import { NovusSession } from './types';

/**
 * Calculate readability score (0-100)
 * Higher score = more readable
 */
export function calculateReadability(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgSentenceLength = words.length / sentences.length;
  const complexWords = words.filter(word => word.length > 6).length;
  const complexWordRatio = complexWords / words.length;
  
  // Simplified Flesch-like scoring
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * complexWordRatio);
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate structure score (0-100)
 * Higher score = better structure
 */
export function calculateStructure(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const lineBreaks = (text.match(/\n/g) || []).length;
  const bulletPoints = (text.match(/[-*•]/g) || []).length;
  const numberedLists = (text.match(/\d+\./g) || []).length;
  const sections = (text.match(/^[#*]+\s+/gm) || []).length;
  
  let score = 0;
  score += Math.min(30, lineBreaks * 5); // Up to 30 points for line breaks
  score += Math.min(20, bulletPoints * 4); // Up to 20 points for bullet points
  score += Math.min(20, numberedLists * 4); // Up to 20 points for numbered lists
  score += Math.min(30, sections * 10); // Up to 30 points for sections
  
  return Math.min(100, score);
}

/**
 * Calculate safety score (0-100)
 * Higher score = more safety considerations
 */
export function calculateSafety(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const safetyKeywords = [
    'ethical', 'bias', 'inclusive', 'respectful', 'accurate', 
    'evidence', 'verified', 'reliable', 'harmful', 'unsafe',
    'appropriate', 'consent', 'privacy', 'confidential'
  ];
  
  const matches = safetyKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
  ).length;
  
  // Each match contributes up to 10 points, max 100
  return Math.min(100, matches * 10);
}

/**
 * Calculate token count (approximate)
 */
export function calculateTokenCount(text: string): number {
  if (!text || text.length === 0) return 0;
  // Rough approximation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Calculate token delta percentage
 */
export function calculateTokenDeltaPct(original: string, optimized: string): number {
  const originalTokens = calculateTokenCount(original);
  const optimizedTokens = calculateTokenCount(optimized);
  
  if (originalTokens === 0) return 0;
  
  return ((optimizedTokens - originalTokens) / originalTokens) * 100;
}

/**
 * Calculate all metrics for a session
 */
export function calculateAllMetrics(input: string, optimized: string): NovusSession['metrics'] {
  return {
    readability: calculateReadability(optimized),
    structure: calculateStructure(optimized),
    safety: calculateSafety(optimized),
    tokenDeltaPct: calculateTokenDeltaPct(input, optimized)
  };
}