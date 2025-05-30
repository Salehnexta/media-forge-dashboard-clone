
import { AIManager } from "@/types/morvo";

interface KeywordMapping {
  [key: string]: string[];
}

// Keywords for each manager specialization
const managerKeywords: KeywordMapping = {
  strategic: [
    'استراتيجية', 'خطة', 'رؤية', 'هدف', 'ميزانية', 'ROI', 'تخطيط', 'مستقبل', 
    'نمو', 'تطوير', 'رؤية مستقبلية', 'أهداف', 'خارطة طريق', 'استثمار', 'عائد'
  ],
  monitor: [
    'انستغرام', 'فيسبوك', 'تويتر', 'منشور', 'تفاعل', 'هاشتاج', 'لايك', 'تعليق',
    'مشاركة', 'فولوز', 'انستا', 'سوشال ميديا', 'منصات', 'تيك توك', 'سناب شات',
    'يوتيوب', 'لينكد ان', 'ستوري', 'ريلز'
  ],
  executor: [
    'إعلان', 'حملة', 'CTR', 'تحويل', 'Google Ads', 'Facebook Ads', 'CPC', 'CPM',
    'إعلانات', 'ترويج', 'استهداف', 'جمهور', 'ميزانية إعلانية', 'تشغيل', 'حملات'
  ],
  creative: [
    'محتوى', 'كتابة', 'صورة', 'فيديو', 'إبداع', 'تصميم', 'نص', 'مقال', 'بوست',
    'كريتيف', 'جرافيك', 'موشن', 'مونتاج', 'فوتوشوب', 'إنشاء', 'صناعة المحتوى'
  ],
  analyst: [
    'تحليل', 'بيانات', 'إحصائيات', 'تقرير', 'مؤشرات', 'SEO', 'أداء', 'قياس',
    'نتائج', 'معدل', 'رقم', 'إحصائية', 'بيانات', 'تحليلات', 'مترك', 'KPI'
  ]
};

export function analyzeQuestion(question: string): AIManager {
  const lowerQuestion = question.toLowerCase();
  const scores: { [key in AIManager]: number } = {
    strategic: 0,
    monitor: 0,
    executor: 0,
    creative: 0,
    analyst: 0
  };

  // Calculate scores for each manager based on keyword matches
  Object.entries(managerKeywords).forEach(([manager, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerQuestion.includes(keyword)) {
        scores[manager as AIManager] += 1;
      }
    });
  });

  // Find the manager with the highest score
  const bestMatch = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as AIManager] > scores[b[0] as AIManager] ? a : b
  );

  // If no clear match, default to strategic manager
  return bestMatch[1] > 0 ? bestMatch[0] as AIManager : 'strategic';
}

export function getManagerResponse(manager: AIManager, question: string): string {
  const responses = {
    strategic: [
      `ممتاز! كاستراتيجي في الفريق، يمكنني مساعدتك في وضع خطة شاملة لهذا الموضوع.`,
      `من منظور استراتيجي، أرى أن هذا السؤال يتطلب تحليل عميق للوضع الحالي والأهداف المستقبلية.`,
      `بصفتي المسؤول عن الاستراتيجية، سأقدم لك رؤية شاملة حول هذا الموضوع.`
    ],
    monitor: [
      `رائع! كمتخصصة في وسائل التواصل الاجتماعي، سأساعدك في تحسين حضورك الرقمي.`,
      `هذا سؤال مهم حول السوشال ميديا! دعيني أشاركك أفضل الممارسات والاستراتيجيات.`,
      `كخبيرة في المنصات الاجتماعية، يمكنني تقديم حلول مبتكرة لتحسين التفاعل والوصول.`
    ],
    executor: [
      `ممتاز! كمدير للحملات الإعلانية، سأساعدك في تحقيق أفضل النتائج من استثماراتك الإعلانية.`,
      `هذا موضوع مهم في عالم الحملات! دعني أوضح لك الاستراتيجيات الأكثر فعالية.`,
      `بخبرتي في إدارة الحملات، يمكنني تقديم نصائح عملية لتحسين الأداء والعائد.`
    ],
    creative: [
      `رائع! كمتخصصة في صناعة المحتوى، سأساعدك في إنشاء محتوى جذاب ومؤثر.`,
      `هذا سؤال إبداعي ممتاز! دعيني أشاركك أفكار مبتكرة لإنشاء محتوى متميز.`,
      `كخبيرة في المحتوى الإبداعي، يمكنني مساعدتك في تطوير أفكار فريدة تجذب جمهورك.`
    ],
    analyst: [
      `ممتاز! كمحلل بيانات، سأقدم لك تحليلاً مفصلاً ومؤشرات دقيقة حول هذا الموضوع.`,
      `هذا سؤال تحليلي مهم! دعني أعرض عليك البيانات والإحصائيات الضرورية.`,
      `بخبرتي في التحليلات، يمكنني تقديم رؤى قائمة على البيانات لاتخاذ قرارات مدروسة.`
    ]
  };

  const managerResponses = responses[manager];
  return managerResponses[Math.floor(Math.random() * managerResponses.length)];
}
