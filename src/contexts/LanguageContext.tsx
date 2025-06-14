
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  ar: {
    // Navigation
    'nav.product': 'المنتج',
    'nav.resources': 'المصادر',
    'nav.support': 'الدعم',
    'nav.login': 'تسجيل الدخول',
    'nav.start_free': 'ابدأ مجاناً',
    
    // Product links
    'product.title': 'المنتج',
    'product.description': 'تعرف على منصة Morvo وإمكانياتها',
    'features.title': 'المميزات',
    'features.description': 'اكتشف جميع مميزات المنصة',
    'how_it_works.title': 'كيف يعمل',
    'how_it_works.description': 'تعلم كيفية استخدام المنصة',
    'pricing.title': 'الأسعار',
    'pricing.description': 'اختر الخطة المناسبة لك',
    
    // Resources
    'success_stories.title': 'قصص النجاح',
    'success_stories.description': 'قصص عملائنا الناجحين',
    'updates.title': 'التحديثات',
    'updates.description': 'آخر التحديثات والإضافات',
    'help_center.title': 'مركز المساعدة',
    'help_center.description': 'دليل استخدام شامل',
    'faq.title': 'الأسئلة الشائعة',
    'faq.description': 'إجابات للأسئلة الشائعة',
    
    // Support
    'support.title': 'الدعم',
    'support.description': 'تواصل مع فريق الدعم',
    'contact.title': 'تواصل معنا',
    'contact.description': 'طرق التواصل المختلفة',
    'status.title': 'حالة الخدمة',
    'status.description': 'مراقبة حالة الخدمات',
    
    // Header
    'header.title': 'منصة مورفو للذكاء الاصطناعي',
    'header.search': 'البحث...',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.analytics': 'التحليلات',
    'dashboard.campaigns': 'الحملات',
    'dashboard.reports': 'التقارير',
    
    // Footer
    'footer.brand_description': 'منصة التسويق الذكي المتكاملة التي تساعدك على تحليل السوق وبناء استراتيجيات تسويقية فعالة باستخدام الذكاء الاصطناعي.',
    'footer.legal': 'الدعم والقانونية',
    'footer.terms': 'الشروط والأحكام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.copyright': '© 2025 Morvo. جميع الحقوق محفوظة.',
    
    // Common
    'ai_analysis.title': 'التحليل الذكي',
    'company': 'الشركة',
    'location': 'الخبر، المملكة العربية السعودية'
  },
  en: {
    // Navigation
    'nav.product': 'Product',
    'nav.resources': 'Resources',
    'nav.support': 'Support',
    'nav.login': 'Login',
    'nav.start_free': 'Start Free',
    
    // Product links
    'product.title': 'Product',
    'product.description': 'Learn about Morvo platform and its capabilities',
    'features.title': 'Features',
    'features.description': 'Discover all platform features',
    'how_it_works.title': 'How It Works',
    'how_it_works.description': 'Learn how to use the platform',
    'pricing.title': 'Pricing',
    'pricing.description': 'Choose the right plan for you',
    
    // Resources
    'success_stories.title': 'Success Stories',
    'success_stories.description': 'Our successful customer stories',
    'updates.title': 'Updates',
    'updates.description': 'Latest updates and additions',
    'help_center.title': 'Help Center',
    'help_center.description': 'Comprehensive usage guide',
    'faq.title': 'FAQ',
    'faq.description': 'Answers to frequently asked questions',
    
    // Support
    'support.title': 'Support',
    'support.description': 'Contact our support team',
    'contact.title': 'Contact Us',
    'contact.description': 'Various contact methods',
    'status.title': 'Service Status',
    'status.description': 'Monitor service status',
    
    // Header
    'header.title': 'Morvo AI Platform',
    'header.search': 'Search...',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.analytics': 'Analytics',
    'dashboard.campaigns': 'Campaigns',
    'dashboard.reports': 'Reports',
    
    // Footer
    'footer.brand_description': 'An integrated smart marketing platform that helps you analyze the market and build effective marketing strategies using artificial intelligence.',
    'footer.legal': 'Support & Legal',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': '© 2025 Morvo. All rights reserved.',
    
    // Common
    'ai_analysis.title': 'AI Analysis',
    'company': 'Company',
    'location': 'Khobar, Saudi Arabia'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-cairo' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
