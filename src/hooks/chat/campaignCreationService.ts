
import { supabase } from '@/integrations/supabase/client';
import { ContextualResponse } from '@/components/chat/types';

export const detectCampaignCreationIntent = (userMessage: string): boolean => {
  const campaignKeywords = [
    'أنشئ حملة',
    'إنشاء حملة', 
    'حملة تسويقية',
    'حملة إعلانية',
    'حملة جديدة',
    'أريد حملة',
    'أبدأ حملة'
  ];
  
  return campaignKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const generateCampaignCreationResponse = (step: number, campaignData?: any): ContextualResponse => {
  const steps = [
    {
      question: "ممتاز! دعني أساعدك في إنشاء حملة تسويقية فعالة. 🎯\n\nما هو الهدف الرئيسي من هذه الحملة؟",
      options: ['زيادة الوعي بالعلامة التجارية', 'زيادة المبيعات', 'جذب عملاء جدد', 'تفاعل أكثر على وسائل التواصل'],
      field: 'objective'
    },
    {
      question: "رائع! الآن، ما هي ميزانيتك المخصصة لهذه الحملة؟ 💰",
      options: ['أقل من 1000 ريال', '1000 - 5000 ريال', '5000 - 15000 ريال', 'أكثر من 15000 ريال'],
      field: 'budget'
    },
    {
      question: "ممتاز! أي منصات تريد التركيز عليها في هذه الحملة؟ 📱",
      options: ['فيسبوك وإنستغرام', 'جوجل وبحث', 'لينكد إن', 'تيك توك', 'جميع المنصات'],
      field: 'platforms'
    },
    {
      question: "مثالي! كم مدة الحملة التي تفضلها؟ ⏰",
      options: ['أسبوع واحد', 'أسبوعين', 'شهر كامل', '3 شهور'],
      field: 'duration'
    },
    {
      question: "ممتاز! من هو جمهورك المستهدف؟ 👥",
      options: ['الشباب (18-30)', 'البالغون (30-45)', 'كبار السن (45+)', 'جميع الأعمار'],
      field: 'audience'
    }
  ];

  if (step < steps.length) {
    const currentStep = steps[step];
    return {
      text: currentStep.question,
      actionButton: {
        label: 'اختر من الخيارات',
        action: () => console.log('Show options')
      },
      stepData: {
        step,
        field: currentStep.field,
        options: currentStep.options
      }
    };
  } else {
    // Generate final campaign preview
    return {
      text: `🎉 تم إنشاء حملتك التسويقية بنجاح!

📊 **ملخص الحملة:**
- **الهدف**: ${campaignData.objective || 'غير محدد'}
- **الميزانية**: ${campaignData.budget || 'غير محددة'}
- **المنصات**: ${campaignData.platforms || 'غير محددة'}
- **المدة**: ${campaignData.duration || 'غير محددة'}
- **الجمهور**: ${campaignData.audience || 'غير محدد'}

🚀 **التوقعات:**
- معدل وصول متوقع: 15,000 - 25,000 شخص
- تفاعل متوقع: 500 - 800 تفاعل
- عائد استثمار متوقع: 150% - 200%

هل تريد حفظ هذه الحملة وبدء تنفيذها؟`,
      actionButton: {
        label: 'حفظ وتنفيذ الحملة',
        action: () => saveCampaign(campaignData)
      }
    };
  }
};

export const saveCampaign = async (campaignData: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('marketing_campaigns')
        .insert({
          name: `حملة ${campaignData.objective || 'تسويقية'} - ${new Date().toLocaleDateString('ar-SA')}`,
          description: `حملة ${campaignData.objective} للجمهور ${campaignData.audience} لمدة ${campaignData.duration}`,
          budget: parseBudget(campaignData.budget),
          target_market: campaignData.audience,
          status: 'draft',
          user_id: user.id,
          goals: { objective: campaignData.objective },
          performance_data: { platforms: campaignData.platforms, duration: campaignData.duration }
        });

      if (!error) {
        console.log('Campaign saved successfully');
      }
    }
  } catch (error) {
    console.error('Error saving campaign:', error);
  }
};

const parseBudget = (budgetText: string): number => {
  if (budgetText?.includes('1000')) return 500;
  if (budgetText?.includes('5000')) return 3000;
  if (budgetText?.includes('15000')) return 10000;
  if (budgetText?.includes('أكثر')) return 20000;
  return 1000;
};
