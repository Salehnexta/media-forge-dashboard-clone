
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const analyzeWithPerplexity = async (companyName: string, website: string, industry: string) => {
  const prompt = `قم بتحليل شامل للشركة التالية باللغة العربية:
الاسم: ${companyName}
الموقع: ${website}
الصناعة: ${industry}

أريد معلومات عن:
1. أهم 5 منافسين في نفس السوق
2. اتجاهات السوق الحالية
3. الفرص المتاحة للنمو
4. التحديات الرئيسية في هذه الصناعة
5. أفضل قنوات التسويق لهذا القطاع

أجب بصيغة JSON منظمة باللغة العربية.`;

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
          content: 'أنت خبير تسويق متخصص في تحليل الشركات والأسواق. أجب باللغة العربية بصيغة JSON منظمة.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateRecommendations = async (companyData: any, marketAnalysis: string) => {
  const prompt = `بناءً على البيانات التالية عن الشركة وتحليل السوق، قم بإنشاء توصيات تسويقية مخصصة:

بيانات الشركة:
${JSON.stringify(companyData, null, 2)}

تحليل السوق:
${marketAnalysis}

أريد توصيات في:
1. استراتيجية المحتوى
2. قنوات التسويق الرقمي المناسبة
3. الجمهور المستهدف
4. الرسائل التسويقية الرئيسية
5. خطة عمل للشهر الأول
6. مؤشرات الأداء المقترحة

أجب بصيغة JSON منظمة باللغة العربية.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير استراتيجي في التسويق الرقمي. قدم توصيات عملية ومفصلة باللغة العربية.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 3000,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyId, userId } = await req.json();
    
    console.log('Starting company analysis for:', companyId);

    // Get company data
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .eq('user_id', userId)
      .single();

    if (companyError || !company) {
      throw new Error('Company not found');
    }

    // Analyze with Perplexity
    console.log('Analyzing with Perplexity...');
    const marketAnalysis = await analyzeWithPerplexity(
      company.name,
      company.website || '',
      company.industry || ''
    );

    // Generate recommendations with GPT-4o
    console.log('Generating recommendations with GPT-4o...');
    const recommendations = await generateRecommendations(company, marketAnalysis);

    // Parse the responses
    let parsedMarketAnalysis;
    let parsedRecommendations;

    try {
      parsedMarketAnalysis = JSON.parse(marketAnalysis);
    } catch {
      parsedMarketAnalysis = { analysis: marketAnalysis };
    }

    try {
      parsedRecommendations = JSON.parse(recommendations);
    } catch {
      parsedRecommendations = { recommendations: recommendations };
    }

    // Save analysis to database
    const { data: analysis, error: analysisError } = await supabase
      .from('company_analysis')
      .upsert({
        company_id: companyId,
        market_insights: parsedMarketAnalysis,
        recommendations: parsedRecommendations,
        competitors: parsedMarketAnalysis.competitors || [],
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      analysis: analysis,
      company: company
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in analyze-company function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to analyze company'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
