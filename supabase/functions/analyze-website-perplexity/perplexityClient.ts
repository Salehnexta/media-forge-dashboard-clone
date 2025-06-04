
import { cleanJsonResponse } from './jsonCleaner.ts';
import { generateFallbackData } from './fallbackData.ts';
import { createPrompts } from './prompts.ts';
import type { AnalysisResults } from './types.ts';

export const analyzeWithPerplexity = async (website: string, perplexityApiKey: string): Promise<AnalysisResults> => {
  console.log('🔍 بدء تحليل الموقع مع Perplexity:', website);

  const prompts = createPrompts(website);
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
