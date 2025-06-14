
import { supabase } from '@/integrations/supabase/client';

export const generateCompanyDataResponse = async (userMessage: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Try to get company data from the companies table
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !company) {
      // Fallback to content_sources_data for company information
      const { data: contentData } = await supabase
        .from('content_sources_data')
        .select('*')
        .eq('client_id', user.id)
        .eq('source_type', 'company_profile')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (contentData?.data) {
        const companyInfo = contentData.data as any;
        return {
          text: `بناءً على بيانات شركتك:
          
الاسم: ${companyInfo.name || 'غير محدد'}
القطاع: ${companyInfo.industry || 'غير محدد'}  
الموقع الإلكتروني: ${companyInfo.website || 'غير محدد'}
الوصف: ${companyInfo.description || 'غير محدد'}
الأسواق الرئيسية: ${companyInfo.primary_markets?.join(', ') || 'غير محدد'}
حجم الشركة: ${companyInfo.size || 'غير محدد'}
سنة التأسيس: ${companyInfo.founded || 'غير محدد'}

كيف يمكنني مساعدتك في تحليل أو تطوير استراتيجيتك التسويقية؟`,
          shareWithAgents: ['M1_STRATEGIC', 'M5_ANALYTICS']
        };
      }
    } else {
      return {
        text: `بناءً على بيانات شركتك:
        
الاسم: ${company.name}
القطاع: ${company.industry || 'غير محدد'}  
الموقع الإلكتروني: ${company.website || 'غير محدد'}
الوصف: ${company.description || 'غير محدد'}
الأسواق الرئيسية: ${company.primary_markets?.join(', ') || 'غير محدد'}
حجم الشركة: ${company.size || 'غير محدد'}
سنة التأسيس: ${company.founded || 'غير محدد'}

كيف يمكنني مساعدتك في تحليل أو تطوير استراتيجيتك التسويقية؟`,
        shareWithAgents: ['M1_STRATEGIC', 'M5_ANALYTICS']
      };
    }

    return null;
  } catch (error) {
    console.error('خطأ في جلب بيانات الشركة:', error);
    return null;
  }
};
