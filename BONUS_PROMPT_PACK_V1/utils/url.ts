export const getUrlParams = (url: string): Record<string, string> => {
  try {
    const urlObject = new URL(url);
    const params: Record<string, string> = {};
    
    // Safe way to handle URL parameters
    urlObject.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {};
  }
}; 