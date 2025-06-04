
import type { AnalysisResults } from './types.ts';

export const organizeResults = (analysis: AnalysisResults, website: string) => {
  return {
    // معلومات الشركة الأساسية
    name: analysis.companyInfo?.name || analysis.companyInfo?.fallbackData?.name || 'شركة غير محددة',
    description: analysis.companyInfo?.description || analysis.companyInfo?.fallbackData?.description || '',
    industry: analysis.companyInfo?.industry || analysis.companyInfo?.fallbackData?.industry || '',
    founded: analysis.companyInfo?.founded || analysis.companyInfo?.fallbackData?.founded || '',
    location: analysis.companyInfo?.location || analysis.companyInfo?.fallbackData?.location || '',
    size: analysis.companyInfo?.size || analysis.companyInfo?.fallbackData?.size || '',
    website: website,
    services: analysis.companyInfo?.services || analysis.companyInfo?.fallbackData?.services || [],
    targetAudience: analysis.companyInfo?.targetAudience || analysis.companyInfo?.fallbackData?.targetAudience || '',

    // المنافسون
    competitors: analysis.competitors?.competitors || analysis.competitors?.fallbackData?.competitors || [],

    // تحليل السوق
    marketInsights: {
      marketSize: analysis.marketAnalysis?.marketSize || analysis.marketAnalysis?.fallbackData?.marketSize || '',
      growthRate: analysis.marketAnalysis?.growthRate || analysis.marketAnalysis?.fallbackData?.growthRate || '',
      trends: analysis.marketAnalysis?.trends || analysis.marketAnalysis?.fallbackData?.trends || [],
      opportunities: analysis.marketAnalysis?.opportunities || analysis.marketAnalysis?.fallbackData?.opportunities || [],
      challenges: analysis.marketAnalysis?.challenges || analysis.marketAnalysis?.fallbackData?.challenges || [],
      predictions: analysis.marketAnalysis?.predictions || analysis.marketAnalysis?.fallbackData?.predictions || []
    },

    // الحضور الرقمي
    digitalPresence: {
      socialMedia: analysis.digitalPresence?.socialMedia || analysis.digitalPresence?.fallbackData?.socialMedia || [],
      seoKeywords: analysis.digitalPresence?.seoKeywords || analysis.digitalPresence?.fallbackData?.seoKeywords || [],
      contentStrategy: analysis.digitalPresence?.contentStrategy || analysis.digitalPresence?.fallbackData?.contentStrategy || [],
      digitalChannels: analysis.digitalPresence?.digitalChannels || analysis.digitalPresence?.fallbackData?.digitalChannels || []
    },

    // البيانات الخام للمراجعة
    rawAnalysis: analysis,
    
    // معلومات إضافية
    analysisStatus: {
      success: true,
      hasErrors: Object.values(analysis).some(result => result?.error),
      timestamp: new Date().toISOString()
    }
  };
};
