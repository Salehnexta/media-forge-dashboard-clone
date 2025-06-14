
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CampaignData {
  name: string;
  description: string;
  objectives: string[];
  target_audience: string;
  budget: number;
  duration: number;
  channels: string[];
  kpis: string[];
}

// Export the missing functions
export const detectCampaignCreationIntent = (message: string): boolean => {
  const campaignKeywords = [
    'حملة', 'campaign', 'إعلان', 'advertisement', 'تسويق', 'marketing',
    'إنشاء حملة', 'create campaign', 'حملة تسويقية', 'marketing campaign'
  ];
  
  return campaignKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const generateCampaignCreationResponse = (step: number, data?: any) => {
  const steps = [
    "ما هو الهدف الرئيسي من الحملة التسويقية؟",
    "ما هي الميزانية المخصصة للحملة؟",
    "ما هي المنصات التي تريد استخدامها؟",
    "ما هي المدة الزمنية للحملة؟",
    "من هو الجمهور المستهدف؟"
  ];

  if (step < steps.length) {
    return {
      text: steps[step],
      actionButton: step === 4 ? {
        label: "إنشاء الحملة",
        action: "createCampaign"
      } : undefined,
      shareWithAgents: ['M1_STRATEGIC', 'M3_CAMPAIGN']
    };
  }

  return {
    text: "تم جمع جميع المعلومات المطلوبة. سأقوم بإنشاء الحملة الآن.",
    actionButton: {
      label: "إنشاء الحملة",
      action: "createCampaign"
    },
    shareWithAgents: ['M1_STRATEGIC', 'M3_CAMPAIGN']
  };
};

export const createCampaign = async (campaignData: CampaignData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('المستخدم غير مصرح له');

    // Store campaign data in content_sources_data table
    const { data, error } = await supabase
      .from('content_sources_data')
      .insert({
        client_id: user.id,
        source_type: 'marketing_campaign',
        data: {
          ...campaignData,
          status: 'draft',
          created_by: user.id,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('تم إنشاء الحملة بنجاح!');
    return { success: true, campaign: data };
  } catch (error: any) {
    console.error('خطأ في إنشاء الحملة:', error);
    toast.error(error.message || 'فشل في إنشاء الحملة');
    return { success: false, error: error.message };
  }
};

export const getCampaigns = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('content_sources_data')
      .select('*')
      .eq('client_id', user.id)
      .eq('source_type', 'marketing_campaign')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('خطأ في جلب الحملات:', error);
    return [];
  }
};

export const updateCampaign = async (campaignId: string, updates: Partial<CampaignData>) => {
  try {
    // Get existing campaign data
    const { data: existing } = await supabase
      .from('content_sources_data')
      .select('data')
      .eq('id', campaignId)
      .single();

    if (!existing) throw new Error('الحملة غير موجودة');

    const existingData = existing.data as any;
    const updatedData = {
      ...existingData,
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('content_sources_data')
      .update({ data: updatedData })
      .eq('id', campaignId);

    if (error) throw error;

    toast.success('تم تحديث الحملة بنجاح!');
    return { success: true };
  } catch (error: any) {
    console.error('خطأ في تحديث الحملة:', error);
    toast.error(error.message || 'فشل في تحديث الحملة');
    return { success: false, error: error.message };
  }
};

export const deleteCampaign = async (campaignId: string) => {
  try {
    const { error } = await supabase
      .from('content_sources_data')
      .delete()
      .eq('id', campaignId);

    if (error) throw error;

    toast.success('تم حذف الحملة بنجاح!');
    return { success: true };
  } catch (error: any) {
    console.error('خطأ في حذف الحملة:', error);
    toast.error(error.message || 'فشل في حذف الحملة');
    return { success: false, error: error.message };
  }
};
