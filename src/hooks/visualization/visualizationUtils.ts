
export const safeParseJSON = (data: any, fallback: any = {}) => {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data || fallback;
  } catch {
    return fallback;
  }
};

export const handleVisualizationError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  return error?.message || `خطأ في ${operation}`;
};
