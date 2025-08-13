// lib/novus/diff.ts - Diff generation utilities

/**
 * Generate a simple word/line diff between two texts
 */
export function generateDiff(original: string, optimized: string): string {
  // For simplicity, we'll create a basic diff representation
  // In a real implementation, you might use a library like diff or jsdiff
  
  const originalLines = original.split('\n');
  const optimizedLines = optimized.split('\n');
  
  let diff = '';
  let i = 0, j = 0;
  
  while (i < originalLines.length || j < optimizedLines.length) {
    if (i < originalLines.length && j < optimizedLines.length) {
      if (originalLines[i] === optimizedLines[j]) {
        // Lines are the same
        diff += ` ${originalLines[i]}\n`;
        i++;
        j++;
      } else {
        // Lines are different
        diff += `- ${originalLines[i]}\n`;
        diff += `+ ${optimizedLines[j]}\n`;
        i++;
        j++;
      }
    } else if (i < originalLines.length) {
      // Original has more lines
      diff += `- ${originalLines[i]}\n`;
      i++;
    } else {
      // Optimized has more lines
      diff += `+ ${optimizedLines[j]}\n`;
      j++;
    }
  }
  
  return diff;
}

/**
 * Generate a simplified diff for display purposes
 */
export function generateSimpleDiff(original: string, optimized: string): string {
  // Create a simplified diff representation
  return `--- Original\n+++ Optimized\n@@ -1,1 +1,1 @@\n-${original.substring(0, 100)}${original.length > 100 ? '...' : ''}\n+${optimized.substring(0, 100)}${optimized.length > 100 ? '...' : ''}`;
}