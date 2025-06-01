
import { AIManager } from "@/types/morvo";

export function analyzeQuestion(question: string): AIManager {
  const lowerQuestion = question.toLowerCase();
  
  // تحليل دقيق للسؤال لتوجيهه للخبير المناسب
  
  // أسئلة حول الشركة والبيانات الأساسية - أولوية عالية
  if (lowerQuestion.includes('شركتي') || 
      lowerQuestion.includes('شركة') || 
      lowerQuestion.includes('اسم') || 
      lowerQuestion.includes('ملف') || 
      lowerQuestion.includes('بيانات') ||
      lowerQuestion.includes('معلومات') ||
      lowerQuestion.includes('تأسيس') ||
      lowerQuestion.includes('خلفية') ||
      lowerQuestion.includes('نبذة') ||
      lowerQuestion.includes('تعريف') ||
      lowerQuestion.includes('هوية') ||
      lowerQuestion.includes('ماهو') ||
      lowerQuestion.includes('ما هو')) {
    return 'strategic';
  }
  
  // أسئلة حول وسائل التواصل الاجتماعي
  if (lowerQuestion.includes('سوشال') || 
      lowerQuestion.includes('تواصل') || 
      lowerQuestion.includes('فيسبوك') || 
      lowerQuestion.includes('انستغرام') ||
      lowerQuestion.includes('تويتر') ||
      lowerQuestion.includes('تيك توك') ||
      lowerQuestion.includes('يوتيوب') ||
      lowerQuestion.includes('لينكد ان') ||
      lowerQuestion.includes('منصات') ||
      lowerQuestion.includes('متابعين') ||
      lowerQuestion.includes('إعجاب') ||
      lowerQuestion.includes('تفاعل') ||
      lowerQuestion.includes('مشاركة') ||
      lowerQuestion.includes('هاشتاج')) {
    return 'monitor';
  }
  
  // أسئلة حول الحملات والإعلانات
  if (lowerQuestion.includes('حملة') || 
      lowerQuestion.includes('إعلان') || 
      lowerQuestion.includes('ترويج') ||
      lowerQuestion.includes('تسويق') ||
      lowerQuestion.includes('دعاية') ||
      lowerQuestion.includes('ميزانية') ||
      lowerQuestion.includes('استهداف') ||
      lowerQuestion.includes('جمهور') ||
      lowerQuestion.includes('عملاء') ||
      lowerQuestion.includes('مبيعات') ||
      lowerQuestion.includes('عائد') ||
      lowerQuestion.includes('استثمار')) {
    return 'executor';
  }
  
  // أسئلة حول المحتوى والإبداع
  if (lowerQuestion.includes('محتوى') || 
      lowerQuestion.includes('كتابة') || 
      lowerQuestion.includes('تصميم') ||
      lowerQuestion.includes('فيديو') ||
      lowerQuestion.includes('صور') ||
      lowerQuestion.includes('جرافيك') ||
      lowerQuestion.includes('إبداع') ||
      lowerQuestion.includes('أفكار') ||
      lowerQuestion.includes('منشور') ||
      lowerQuestion.includes('مقال') ||
      lowerQuestion.includes('نص') ||
      lowerQuestion.includes('كوبي') ||
      lowerQuestion.includes('قصة') ||
      lowerQuestion.includes('سيناريو')) {
    return 'creative';
  }
  
  // أسئلة حول التحليل والبيانات
  if (lowerQuestion.includes('تحليل') || 
      lowerQuestion.includes('بيانات') || 
      lowerQuestion.includes('أرقام') ||
      lowerQuestion.includes('تقرير') ||
      lowerQuestion.includes('إحصائيات') ||
      lowerQuestion.includes('مؤشرات') ||
      lowerQuestion.includes('نتائج') ||
      lowerQuestion.includes('أداء') ||
      lowerQuestion.includes('قياس') ||
      lowerQuestion.includes('رسم بياني') ||
      lowerQuestion.includes('شارت') ||
      lowerQuestion.includes('نمو') ||
      lowerQuestion.includes('ترند') ||
      lowerQuestion.includes('اتجاه')) {
    return 'analyst';
  }
  
  // أسئلة الاستراتيجية والتخطيط
  if (lowerQuestion.includes('استراتيجية') || 
      lowerQuestion.includes('خطة') || 
      lowerQuestion.includes('تخطيط') ||
      lowerQuestion.includes('هدف') ||
      lowerQuestion.includes('رؤية') ||
      lowerQuestion.includes('مستقبل') ||
      lowerQuestion.includes('نمو') ||
      lowerQuestion.includes('تطوير') ||
      lowerQuestion.includes('تحسين') ||
      lowerQuestion.includes('منافس') ||
      lowerQuestion.includes('سوق') ||
      lowerQuestion.includes('فرص')) {
    return 'strategic';
  }
  
  // إذا كان السؤال قصير جداً أو غير واضح، ارجع للوكيل الاستراتيجي
  return 'strategic';
}
