import { ProcessResult, ProductStrategy } from './types';
import { generateDiff } from './diff';

export async function runPipeline(
  input: string, 
  params: Record<string, any>, 
  strategy: ProductStrategy
): Promise<ProcessResult> {
  try {
    const result = await strategy.run(input, params);
    
    if (result.diff === undefined) {
      result.diff = generateDiff(input, result.output);
    }
    
    return result;
  } catch (error) {
    console.error('Pipeline error:', error);
    throw new Error(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateInput(input: string, minLength: number = 10, maxLength: number = 10000): void {
  if (!input || input.trim().length === 0) {
    throw new Error('Input cannot be empty');
  }
  
  if (input.length < minLength) {
    throw new Error(`Input must be at least ${minLength} characters long`);
  }
  
  if (input.length > maxLength) {
    throw new Error(`Input must be no more than ${maxLength} characters long`);
  }
}

export function applyVariables(text: string, variables: Record<string, string>): string {
  let result = text;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });
  return result;
}