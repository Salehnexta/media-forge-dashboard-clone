
export const environment = {
  morvoApiUrl: 'https://morvo-production.up.railway.app',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Export for backward compatibility
export const config = environment;
