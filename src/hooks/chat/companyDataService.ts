
import { supabase } from '@/integrations/supabase/client';
import { ContextualResponse } from '@/components/chat/types';

export const generateCompanyDataResponse = async (userMessage: string): Promise<ContextualResponse | null> => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('شركة') || lowerMessage.includes('اسم') || lowerMessage.includes('ملف') || lowerMessage.includes('بيانات') || lowerMessage.includes('معلومات')) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (company) {
          return {
            text: `بناءً على بيانات ملفك الشخصي، اسم شركتك هو: **${company.name}**

🏢 **تفاصيل الشركة:**
- **الصناعة**: ${company.industry}
- **الموقع الإلكتروني**: ${company.website || 'غير محدد'}
- **الوصف**: ${company.description || 'غير محدد'}
- **الأسواق المستهدفة**: ${company.primary_markets?.join(', ') || 'غير محدد'}
- **حجم الشركة**: ${company.size || 'غير محدد'}
- **سنة التأسيس**: ${company.founded || 'غير محدد'}

هل تريد تحديث أي من هذه المعلومات أو تحتاج تحليل استراتيجي للشركة؟`,
            actionButton: {
              label: 'تحديث بيانات الشركة',
              action: () => window.location.href = '/onboarding'
            }
          };
        } else {
          return {
            text: `لم أجد بيانات شركتك في النظام بعد. يمكنني مساعدتك في إعداد ملف شركتك الآن.

📝 **سأحتاج المعلومات التالية:**
- اسم الشركة
- نوع الصناعة
- الموقع الإلكتروني
- وصف مختصر عن الشركة
- السوق المستهدف
- حجم الشركة

هل تريد البدء في إعداد ملف شركتك؟`,
            actionButton: {
              label: 'إعداد ملف الشركة',
              action: () => window.location.href = '/onboarding'
            }
          };
        }
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      return {
        text: `عذراً، حدث خطأ في استرجاع بيانات شركتك. يرجى المحاولة مرة أخرى أو التأكد من تسجيل الدخول بشكل صحيح.`
      };
    }
  }
  
  return null;
};
