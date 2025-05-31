
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const analyzeWithPerplexity = async (website: string) => {
  console.log('🔍 بدء تحليل الموقع مع Perplexity:', website);

  const prompts = {
    companyInfo: `قم بتحليل الشركة صاحبة الموقع ${website} وأعطني المعلومات التالية بصيغة JSON:
{
  "name": "اسم الشركة الكامل",
  "description": "وصف نشاط الشركة التجاري", 
  "industry": "المجال/الصناعة",
  "founded": "سنة التأسيس",
  "location": "المقر الرئيسي والدولة",
  "size": "عدد الموظفين التقريبي أو حجم الشركة",
  "website": "${website}",
  "services": ["الخدمات الرئيسية"],
  "targetAudience": "الجمهور المستهدف"
}`,

    competitors: `من هم أهم 5 منافسين للشركة صاحبة الموقع ${website}؟ أعطني القائمة بصيغة JSON:
{
  "competitors": [
    {
      "name": "اسم الشركة المنافسة",
      "website": "موقعها الإلكتروني",
      "strengths": ["نقاط قوتها الأساسية"]
    }
  ]
}`,

    marketAnalysis: `تحليل السوق والصناعة للشركة صاحبة الموقع ${website}. أعطني التحليل بصيغة JSON:
{
  "marketSize": "حجم السوق",
  "growthRate": "معدل النمو السنوي",
  "trends": ["أحدث الاتجاهات والتطورات"],
  "opportunities": ["الفرص المتاحة"],
  "challenges": ["التحديات الرئيسية"],
  "predictions": ["التوقعات المستقبلية"]
}`,

    digitalPresence: `تحليل الحضور الرقمي للشركة صاحبة الموقع ${website}. أعطني التحليل بصيغة JSON:
{
  "socialMedia": ["حسابات وسائل التواصل الاجتماعي"],
  "seoKeywords": ["أهم الكلمات المفتاحية"],
  "contentStrategy": ["استراتيجية المحتوى المقترحة"],
  "digitalChannels": ["القنوات الرقمية المناسبة"]
}`
  };

  const results: any = {};

  for (const [key, prompt] of Object.entries(prompts)) {
    try {
      console.log(`📊 تحليل ${key}...`);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير تحليل الأعمال والتسويق. أجب باللغة العربية بصيغة JSON صحيحة فقط. لا تضيف أي نص قبل أو بعد JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // محاولة تحليل JSON
      try {
        const parsed = JSON.parse(content);
        results[key] = parsed;
      } catch (parseError) {
        console.error(`خطأ في تحليل JSON لـ ${key}:`, parseError);
        // في حالة فشل التحليل، احفظ النص كما هو
        results[key] = { rawContent: content };
      }

      // انتظار قصير بين الطلبات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`خطأ في تحليل ${key}:`, error);
      results[key] = { error: error.message };
    }
  }

  return results;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { website } = await req.json();
    
    if (!website) {
      throw new Error('رابط الموقع مطلوب');
    }

    console.log('🚀 بدء تحليل الموقع:', website);

    // تحليل الموقع باستخدام Perplexity
    const analysis = await analyzeWithPerplexity(website);

    // تنظيم النتائج
    const companyData = {
      // معلومات الشركة الأساسية
      name: analysis.companyInfo?.name || 'غير محدد',
      description: analysis.companyInfo?.description || '',
      industry: analysis.companyInfo?.industry || '',
      founded: analysis.companyInfo?.founded || '',
      location: analysis.companyInfo?.location || '',
      size: analysis.companyInfo?.size || '',
      website: website,
      services: analysis.companyInfo?.services || [],
      targetAudience: analysis.companyInfo?.targetAudience || '',

      // المنافسون
      competitors: analysis.competitors?.competitors || [],

      // تحليل السوق
      marketInsights: {
        marketSize: analysis.marketAnalysis?.marketSize || '',
        growthRate: analysis.marketAnalysis?.growthRate || '',
        trends: analysis.marketAnalysis?.trends || [],
        opportunities: analysis.marketAnalysis?.opportunities || [],
        challenges: analysis.marketAnalysis?.challenges || [],
        predictions: analysis.marketAnalysis?.predictions || []
      },

      // الحضور الرقمي
      digitalPresence: {
        socialMedia: analysis.digitalPresence?.socialMedia || [],
        seoKeywords: analysis.digitalPresence?.seoKeywords || [],
        contentStrategy: analysis.digitalPresence?.contentStrategy || [],
        digitalChannels: analysis.digitalPresence?.digitalChannels || []
      },

      // البيانات الخام للمراجعة
      rawAnalysis: analysis
    };

    console.log('✅ تم إكمال التحليل بنجاح');

    return new Response(JSON.stringify({
      success: true,
      data: companyData,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('❌ خطأ في تحليل الموقع:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: 'فشل في تحليل الموقع باستخدام Perplexity AI'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
