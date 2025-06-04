
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { analyzeWithPerplexity } from './perplexityClient.ts';
import { organizeResults } from './dataOrganizer.ts';

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const analysis = await analyzeWithPerplexity(website, perplexityApiKey);

    // تنظيم النتائج مع معالجة الأخطاء
    const companyData = organizeResults(analysis, website);

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
