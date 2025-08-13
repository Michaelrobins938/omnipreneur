// lib/novus/cal.ts - CAL™ (Cognitive Architecture Layering) pipeline
import { NovusSession } from './types';

/**
 * CAL™ (Cognitive Architecture Layering) pipeline
 * Implements deterministic optimization stages for AI prompts
 */

// Stage 1: Normalize tone and structure
export function normalizeTone(prompt: string): { prompt: string; improvements: string[] } {
  const improvements: string[] = [];
  let normalized = prompt.trim();
  
  // Add role definition if missing
  if (!/^\s*(You are|Act as|Imagine you|Assume the role)/i.test(normalized)) {
    normalized = `Act as a professional expert in this domain. ${normalized}`;
    improvements.push('Added role definition for better context');
  }
  
  // Ensure proper sentence structure
  if (!/[.!?]\s*$/.test(normalized)) {
    normalized = `${normalized}.`;
    improvements.push('Added proper sentence termination');
  }
  
  // Capitalize first letter if not already
  if (normalized.charAt(0) !== normalized.charAt(0).toUpperCase()) {
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    improvements.push('Capitalized first letter');
  }
  
  return { prompt: normalized, improvements };
}

// Stage 2: Enforce structure and constraints
export function enforceStructure(prompt: string): { prompt: string; improvements: string[] } {
  const improvements: string[] = [];
  let structured = prompt;
  
  // Add clear instruction if missing
  if (!/^\s*(Please|You are|Act as)/i.test(structured)) {
    structured = `Please provide a detailed response that:\n${structured}`;
    improvements.push('Added clear instruction format');
  }
  
  // Add structure requirements if missing
  if (!/structure|organize|format/i.test(structured)) {
    structured = `${structured}\n\nStructure your response with clear sections or bullet points.`;
    improvements.push('Added structure requirements');
  }
  
  // Add constraint requirements if missing
  if (!/constraint|limitation|specific/i.test(structured)) {
    structured = `${structured}\n\nBe specific and include concrete examples where relevant.`;
    improvements.push('Added specificity requirements');
  }
  
  return { prompt: structured, improvements };
}

// Stage 3: Apply constraints for clarity
export function applyConstraints(prompt: string): { prompt: string; improvements: string[] } {
  const improvements: string[] = [];
  let constrained = prompt;
  
  // Add clarity requirements
  if (!/clear|concise|understandable/i.test(constrained)) {
    constrained = `${constrained}\n\nBe clear, concise, and ensure all information is accurate and helpful.`;
    improvements.push('Added clarity requirements');
  }
  
  // Add actionable requirements
  if (!/actionable|step|procedure/i.test(constrained)) {
    constrained = `${constrained}\n\nProvide actionable steps or procedures where applicable.`;
    improvements.push('Added actionable requirements');
  }
  
  return { prompt: constrained, improvements };
}

// Stage 4: Safety phrasing
export function applySafety(prompt: string): { prompt: string; improvements: string[] } {
  const improvements: string[] = [];
  let safe = prompt;
  
  // Add ethical guidelines
  if (!/ethical|bias|inclusive|respectful/i.test(safe)) {
    safe = `${safe}\n\nFollow ethical guidelines, avoid bias, and be respectful in your response.`;
    improvements.push('Added ethical guidelines');
  }
  
  // Add accuracy requirements
  if (!/accurate|fact|verify|evidence/i.test(safe)) {
    safe = `${safe}\n\nEnsure accuracy and provide evidence-based information.`;
    improvements.push('Added accuracy requirements');
  }
  
  return { prompt: safe, improvements };
}

// Main CAL™ pipeline function
export function runCALPipeline(prompt: string): {
  optimized: string;
  improvements: string[];
  metrics: NovusSession['metrics'];
  diff: string;
} {
  const original = prompt;
  let current = prompt;
  const allImprovements: string[] = [];
  
  // Stage 1: Normalize tone
  const toneResult = normalizeTone(current);
  current = toneResult.prompt;
  allImprovements.push(...toneResult.improvements);
  
  // Stage 2: Enforce structure
  const structureResult = enforceStructure(current);
  current = structureResult.prompt;
  allImprovements.push(...structureResult.improvements);
  
  // Stage 3: Apply constraints
  const constraintsResult = applyConstraints(current);
  current = constraintsResult.prompt;
  allImprovements.push(...constraintsResult.improvements);
  
  // Stage 4: Apply safety
  const safetyResult = applySafety(current);
  current = safetyResult.prompt;
  allImprovements.push(...safetyResult.improvements);
  
  // Generate diff
  const diff = generateDiff(original, current);
  
  // Calculate metrics
  const metrics = calculateMetrics(original, current);
  
  return {
    optimized: current,
    improvements: allImprovements,
    metrics,
    diff
  };
}

// Simple diff generation
function generateDiff(original: string, optimized: string): string {
  // In a real implementation, this would be a more sophisticated diff
  // For now, we'll just return a simple representation
  return `--- Original
+++ Optimized
@@ -1,1 +1,1 @@
-${original}
+${optimized}`;
}

// Metrics calculation
function calculateMetrics(original: string, optimized: string): NovusSession['metrics'] {
  // Calculate readability (simplified)
  const calculateReadability = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgSentenceLength = words.length / sentences.length;
    // Simple scoring: shorter average sentence length = higher readability
    return Math.max(0, Math.min(100, 100 - (avgSentenceLength * 5)));
  };
  
  // Calculate structure score (simplified)
  const calculateStructure = (text: string): number => {
    const hasLineBreaks = (text.match(/\n/g) || []).length;
    const hasBulletPoints = /[-*•]/.test(text);
    const hasNumberedLists = /\d+\./.test(text);
    
    let score = 0;
    if (hasLineBreaks > 2) score += 30;
    if (hasBulletPoints) score += 30;
    if (hasNumberedLists) score += 40;
    
    return Math.min(100, score);
  };
  
  // Calculate safety score (simplified)
  const calculateSafety = (text: string): number => {
    const safetyKeywords = ['ethical', 'bias', 'inclusive', 'respectful', 'accurate', 'evidence'];
    const matches = safetyKeywords.filter(keyword => 
      new RegExp(keyword, 'i').test(text)
    ).length;
    
    return Math.min(100, matches * 20);
  };
  
  // Calculate token delta percentage (simplified)
  const calculateTokenDelta = (original: string, optimized: string): number => {
    const originalTokens = original.split(/\s+/).length;
    const optimizedTokens = optimized.split(/\s+/).length;
    return ((optimizedTokens - originalTokens) / originalTokens) * 100;
  };
  
  return {
    readability: calculateReadability(optimized),
    structure: calculateStructure(optimized),
    safety: calculateSafety(optimized),
    tokenDeltaPct: calculateTokenDelta(original, optimized)
  };
}