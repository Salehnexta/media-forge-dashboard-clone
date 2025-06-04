
export const generateFallbackData = async (type: string, website: string) => {
  console.log(`🔄 إنشاء بيانات احتياطية لـ ${type}`);
  
  // استخراج اسم النطاق
  const domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const companyName = domain.split('.')[0];
  
  switch (type) {
    case 'companyInfo':
      return {
        name: `شركة ${companyName}`,
        description: 'شركة تقدم خدمات متنوعة',
        industry: 'غير محدد',
        founded: 'غير محدد',
        location: 'غير محدد',
        size: 'غير محدد',
        website: website,
        services: ['خدمات عامة'],
        targetAudience: 'عملاء متنوعون'
      };
    
    case 'competitors':
      return {
        competitors: [
          {
            name: 'منافس 1',
            website: 'غير محدد',
            strengths: ['خدمات متنوعة']
          }
        ]
      };
    
    case 'marketAnalysis':
      return {
        marketSize: 'يتطلب دراسة أعمق',
        growthRate: 'غير محدد',
        trends: ['نمو في القطاع الرقمي'],
        opportunities: ['التوسع الرقمي'],
        challenges: ['المنافسة الشديدة'],
        predictions: ['نمو مستمر متوقع']
      };
    
    case 'digitalPresence':
      return {
        socialMedia: ['يتطلب مراجعة يدوية'],
        seoKeywords: ['اسم الشركة', 'الخدمات'],
        contentStrategy: ['محتوى تفاعلي', 'قصص نجاح'],
        digitalChannels: ['موقع إلكتروني', 'وسائل التواصل']
      };
    
    default:
      return { message: 'بيانات احتياطية عامة' };
  }
};
