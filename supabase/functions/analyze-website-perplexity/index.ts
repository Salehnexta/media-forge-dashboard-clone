
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const cleanJsonResponse = (content: string): string => {
  console.log('Original content:', content);
  
  // إزالة markdown code blocks
  let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // إزالة أي نص قبل أو بعد JSON
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  console.log('Cleaned content:', cleaned);
  return cleaned;
};

const analyzeWithPerplexity = async (website: string) => {
  console.log('🔍 بدء تحليل الموقع مع Perplexity:', website);

  const prompts = {
    companyInfo: `Analyze the company that owns the website ${website}. Return ONLY a JSON object with this exact structure (no extra text, no markdown):
{
  "name": "Company full name in Arabic",
  "description": "Business activity description in Arabic", 
  "industry": "Industry/sector in Arabic",
  "founded": "Founding year",
  "location": "Main headquarters and country in Arabic",
  "size": "Approximate number of employees or company size in Arabic",
  "website": "${website}",
  "services": ["Main services in Arabic"],
  "targetAudience": "Target audience in Arabic"
}`,

    competitors: `Find the top 5 competitors of the company that owns ${website}. Return ONLY a JSON object (no extra text, no markdown):
{
  "competitors": [
    {
      "name": "Competitor company name in Arabic",
      "website": "Their website URL",
      "strengths": ["Their key strengths in Arabic"]
    }
  ]
}`,

    marketAnalysis: `Analyze the market and industry for the company that owns ${website}. Return ONLY a JSON object (no extra text, no markdown):
{
  "marketSize": "Market size in Arabic",
  "growthRate": "Annual growth rate in Arabic",
  "trends": ["Latest trends and developments in Arabic"],
  "opportunities": ["Available opportunities in Arabic"],
  "challenges": ["Main challenges in Arabic"],
  "predictions": ["Future predictions in Arabic"]
}`,

    digitalPresence: `Analyze the digital presence of the company that owns ${website}. Return ONLY a JSON object (no extra text, no markdown):
{
  "socialMedia": ["Social media accounts in Arabic"],
  "seoKeywords": ["Important SEO keywords in Arabic"],
  "contentStrategy": ["Suggested content strategy in Arabic"],
  "digitalChannels": ["Suitable digital channels in Arabic"]
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
              content: 'You are a business analysis expert. Return ONLY valid JSON without any markdown formatting, explanations, or additional text. Answer in Arabic where specified.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log(`Raw response for ${key}:`, content);
      
      // تنظيف الاستجابة وتحليل JSON
      try {
        const cleanedContent = cleanJsonResponse(content);
        const parsed = JSON.parse(cleanedContent);
        results[key] = parsed;
        console.log(`✅ نجح تحليل ${key}`);
      } catch (parseError) {
        console.error(`خطأ في تحليل JSON لـ ${key}:`, parseError);
        console.log(`Attempting fallback for ${key}...`);
        
        // محاولة استخراج المعلومات يدوياً كحل احتياطي
        results[key] = {
          error: `فشل تحليل JSON: ${parseError.message}`,
          rawContent: content,
          fallbackData: await generateFallbackData(key, website)
        };
      }

      // انتظار قصير بين الطلبات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`خطأ في تحليل ${key}:`, error);
      results[key] = { 
        error: error.message,
        fallbackData: await generateFallbackData(key, website)
      };
    }
  }

  return results;
};

const generateFallbackData = async (type: string, website: string) => {
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

    // تنظيم النتائج مع معالجة الأخطاء
    const companyData = {
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
