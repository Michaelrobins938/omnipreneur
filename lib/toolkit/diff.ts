export function generateDiff(original: string, result: string): string {
  const originalLines = original.split('\n');
  const resultLines = result.split('\n');
  
  let diff = '';
  let i = 0, j = 0;
  
  while (i < originalLines.length || j < resultLines.length) {
    if (i < originalLines.length && j < resultLines.length) {
      if (originalLines[i] === resultLines[j]) {
        diff += ` ${originalLines[i]}\n`;
        i++;
        j++;
      } else {
        diff += `- ${originalLines[i]}\n`;
        diff += `+ ${resultLines[j]}\n`;
        i++;
        j++;
      }
    } else if (i < originalLines.length) {
      diff += `- ${originalLines[i]}\n`;
      i++;
    } else {
      diff += `+ ${resultLines[j]}\n`;
      j++;
    }
  }
  
  return diff;
}

export function generateSimpleDiff(original: string, result: string): string {
  return `--- Original\n+++ Result\n@@ -1,1 +1,1 @@\n-${original.substring(0, 100)}${original.length > 100 ? '...' : ''}\n+${result.substring(0, 100)}${result.length > 100 ? '...' : ''}`;
}