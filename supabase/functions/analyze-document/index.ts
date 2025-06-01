
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filePath, userId } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // تحميل الملف من Storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('company-documents')
      .download(filePath)

    if (downloadError) {
      throw new Error(`Error downloading file: ${downloadError.message}`)
    }

    // قراءة محتوى الملف
    const fileContent = await fileData.text()
    
    // هنا يمكن إضافة تحليل الملف باستخدام OpenAI أو أي API آخر
    // للتبسيط، سنقوم بتحليل أساسي
    const analysis = {
      wordCount: fileContent.split(' ').length,
      summary: 'تم تحليل الملف بنجاح',
      keyPhrases: extractKeyPhrases(fileContent),
      sentiment: 'positive',
      categories: categorizeContent(fileContent),
      recommendations: generateRecommendations(fileContent)
    }

    // حفظ نتائج التحليل في قاعدة البيانات
    const { error: updateError } = await supabaseClient
      .from('company_documents')
      .update({
        analysis_status: 'analyzed',
        analysis_results: analysis,
        analyzed_at: new Date().toISOString()
      })
      .eq('file_path', filePath)
      .eq('user_id', userId)

    if (updateError) {
      throw new Error(`Error updating analysis: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in analyze-document function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function extractKeyPhrases(content: string): string[] {
  // تحليل بسيط لاستخراج العبارات المفتاحية
  const words = content.toLowerCase().split(/\s+/)
  const keyWords = words.filter(word => 
    word.length > 4 && 
    !['والذي', 'التي', 'هذا', 'هذه', 'ذلك', 'تلك'].includes(word)
  )
  
  // إرجاع أهم 10 كلمات
  const wordFreq = keyWords.reduce((acc: Record<string, number>, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

function categorizeContent(content: string): string[] {
  const categories = []
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('مبيعات') || lowerContent.includes('إيراد')) {
    categories.push('مبيعات')
  }
  if (lowerContent.includes('تسويق') || lowerContent.includes('إعلان')) {
    categories.push('تسويق')
  }
  if (lowerContent.includes('استراتيجية') || lowerContent.includes('خطة')) {
    categories.push('استراتيجية')
  }
  if (lowerContent.includes('منافس') || lowerContent.includes('سوق')) {
    categories.push('تحليل السوق')
  }
  if (lowerContent.includes('ميزانية') || lowerContent.includes('تكلفة')) {
    categories.push('مالية')
  }
  
  return categories.length > 0 ? categories : ['عام']
}

function generateRecommendations(content: string): string[] {
  const recommendations = []
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('مبيعات')) {
    recommendations.push('تحسين عملية المبيعات باستخدام أدوات CRM')
    recommendations.push('تدريب فريق المبيعات على تقنيات البيع الحديثة')
  }
  
  if (lowerContent.includes('تسويق')) {
    recommendations.push('تطوير استراتيجية تسويق رقمي شاملة')
    recommendations.push('الاستثمار في وسائل التواصل الاجتماعي')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('تطوير خطة عمل شاملة')
    recommendations.push('تحليل المنافسين في السوق')
  }
  
  return recommendations
}
