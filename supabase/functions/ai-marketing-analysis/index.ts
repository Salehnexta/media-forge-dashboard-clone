
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  website: string;
  step: 'perplexity' | 'gpt4' | 'complete';
}

interface PerplexityResponse {
  company: any;
  competitors: any;
  market: any;
  digitalPresence: any;
}

class PerplexityService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeCompany(website: string): Promise<PerplexityResponse> {
    const queries = [
      `Analyze company at ${website}: name, industry, location, size, founding year, main products/services`,
      `Find top 5 main competitors of company at ${website} with their market share and strengths`,
      `Market analysis for industry of company at ${website}: market size, growth rate, trends, opportunities`,
      `Digital presence analysis for ${website}: social media followers, SEO ranking, website traffic, digital marketing activities`
    ];

    const results = [];
    
    for (const query of queries) {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a business analyst. Provide accurate, structured data about companies and markets.'
              },
              {
                role: 'user',
                content: query
              }
            ],
            temperature: 0.2,
            max_tokens: 1000,
            return_images: false,
            return_related_questions: false,
            search_recency_filter: 'month'
          })
        });

        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        results.push(data.choices[0].message.content);
      } catch (error) {
        console.error('Perplexity query error:', error);
        results.push('بيانات غير متوفرة');
      }
    }

    return this.parseResults(results, website);
  }

  private parseResults(results: string[], website: string): PerplexityResponse {
    return {
      company: {
        website,
        analysis: results[0] || 'تحليل الشركة غير متوفر',
        timestamp: new Date().toISOString()
      },
      competitors: {
        analysis: results[1] || 'تحليل المنافسين غير متوفر',
        timestamp: new Date().toISOString()
      },
      market: {
        analysis: results[2] || 'تحليل السوق غير متوفر', 
        timestamp: new Date().toISOString()
      },
      digitalPresence: {
        analysis: results[3] || 'تحليل الحضور الرقمي غير متوفر',
        timestamp: new Date().toISOString()
      }
    };
  }
}

class GPT4Service {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStrategies(perplexityData: PerplexityResponse) {
    const prompt = `
    بناءً على تحليل الشركة التالي:
    
    معلومات الشركة: ${perplexityData.company.analysis}
    
    المنافسون: ${perplexityData.competitors.analysis}
    
    تحليل السوق: ${perplexityData.market.analysis}
    
    الحضور الرقمي: ${perplexityData.digitalPresence.analysis}
    
    أنشئ استراتيجية تسويقية شاملة باللغة العربية تتضمن:
    1. ملخص تنفيذي
    2. استراتيجية المحتوى
    3. أولويات القنوات التسويقية الرقمية
    4. شرائح الجمهور المستهدف
    5. أفكار حملات مع ميزانيات مقترحة
    6. جدول زمني للتنفيذ (3-6 أشهر)
    7. مؤشرات الأداء المتوقعة وعائد الاستثمار
    8. توصيات عملية فورية
    
    اجعل الاستراتيجية عملية وقابلة للتطبيق في السوق السعودي/الخليجي.
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير تسويق رقمي متخصص في السوق السعودي والخليجي. تقدم استراتيجيات عملية ومحددة بناءً على البيانات الحقيقية.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        strategy: data.choices[0].message.content,
        timestamp: new Date().toISOString(),
        model: 'gpt-4o'
      };
    } catch (error) {
      console.error('GPT-4 error:', error);
      throw new Error('فشل في إنشاء الاستراتيجية التسويقية');
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { website, step }: AnalysisRequest = await req.json();

    if (!website) {
      return new Response(
        JSON.stringify({ error: 'الموقع الإلكتروني مطلوب' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!perplexityKey || !openaiKey) {
      return new Response(
        JSON.stringify({ error: 'مفاتيح API غير متوفرة' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const perplexityService = new PerplexityService(perplexityKey);
    const gpt4Service = new GPT4Service(openaiKey);

    let result;

    switch (step) {
      case 'perplexity':
        console.log('🔍 بدء تحليل البيانات من Perplexity...');
        result = await perplexityService.analyzeCompany(website);
        break;

      case 'gpt4':
        // For this step, we need the perplexity data passed in the request
        const perplexityData = (await req.json()).perplexityData;
        console.log('🧠 بدء إنشاء الاستراتيجية بـ GPT-4o...');
        result = await gpt4Service.generateStrategies(perplexityData);
        break;

      case 'complete':
        console.log('⚡ بدء التحليل الشامل...');
        const perplexityResult = await perplexityService.analyzeCompany(website);
        const strategyResult = await gpt4Service.generateStrategies(perplexityResult);
        
        result = {
          website,
          perplexityData: perplexityResult,
          strategy: strategyResult,
          workflow: {
            phases: [
              {
                name: 'التحضير والإعداد',
                duration: '1-2 أسابيع',
                tasks: ['إعداد الحملات', 'إنشاء المحتوى الأساسي', 'تحديد الجمهور']
              },
              {
                name: 'الإطلاق والتنفيذ',
                duration: '2-4 أسابيع', 
                tasks: ['إطلاق الحملات', 'المراقبة اليومية', 'التفاعل مع الجمهور']
              },
              {
                name: 'التحسين والتوسع',
                duration: '1-3 أشهر',
                tasks: ['تحليل الأداء', 'تحسين الحملات', 'توسيع النطاق']
              }
            ],
            priorities: [
              { task: 'تحسين الموقع الإلكتروني', priority: 'عالية', impact: '85%' },
              { task: 'إنشاء محتوى قيم', priority: 'عالية', impact: '80%' },
              { task: 'التسويق عبر وسائل التواصل', priority: 'متوسطة', impact: '75%' },
              { task: 'الإعلانات المدفوعة', priority: 'متوسطة', impact: '70%' }
            ]
          },
          summary: {
            analysisDate: new Date().toISOString(),
            status: 'مكتمل',
            estimatedBudget: '20,000 - 50,000 ريال شهرياً',
            expectedTimeframe: '3-6 أشهر للنتائج الأولية'
          }
        };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'نوع التحليل غير صحيح' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-marketing-analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ أثناء التحليل',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
