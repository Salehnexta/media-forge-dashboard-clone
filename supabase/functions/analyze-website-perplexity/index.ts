
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { website } = await req.json()

    if (!website) {
      throw new Error('Website URL is required')
    }

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured')
    }

    const prompt = `
      Analyze the website ${website} and provide comprehensive business intelligence in JSON format:
      {
        "businessDescription": "Brief description in Arabic and English",
        "industry": "Primary industry/sector",
        "competitors": ["competitor1.com", "competitor2.com", "competitor3.com"],
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "socialMedia": {
          "instagram": "handle/URL",
          "twitter": "handle/URL", 
          "linkedin": "company page",
          "facebook": "page URL"
        },
        "targetAudience": {
          "demographics": "Primary audience description",
          "ageGroups": ["25-35", "36-45"],
          "interests": ["interest1", "interest2"],
          "behavior": "Audience behavior patterns"
        },
        "marketingChannels": ["social_media", "seo", "content_marketing"],
        "contentThemes": ["theme1", "theme2", "theme3"],
        "brandPersonality": "professional/friendly/modern/traditional",
        "suggestedBudget": "recommended monthly marketing budget range"
      }
      
      Focus on Arabic/GCC market context. Provide Arabic translations where applicable.
      Return only the JSON object, no additional text.
    `

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a business analysis expert. Analyze websites and provide detailed business intelligence data in JSON format. Be precise and focus on Arabic/GCC market context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Perplexity API error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('No analysis content received from Perplexity')
    }

    // Try to parse JSON from the response
    let analysisData
    try {
      // Remove any potential markdown formatting
      const cleanText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisData = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // Fallback: create a basic structure
      analysisData = {
        businessDescription: analysisText,
        industry: "غير محدد",
        competitors: [],
        keywords: [],
        socialMedia: {},
        targetAudience: {
          demographics: "غير محدد",
          ageGroups: [],
          interests: [],
          behavior: "غير محدد"
        },
        marketingChannels: [],
        contentThemes: [],
        brandPersonality: "غير محدد",
        suggestedBudget: "غير محدد"
      }
    }

    return new Response(
      JSON.stringify(analysisData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallbackData: {
          businessDescription: "تعذر تحليل الموقع، يرجى إدخال البيانات يدوياً",
          industry: "غير محدد",
          competitors: [],
          keywords: [],
          socialMedia: {},
          targetAudience: {
            demographics: "غير محدد",
            ageGroups: [],
            interests: [],
            behavior: "غير محدد"
          },
          marketingChannels: [],
          contentThemes: [],
          brandPersonality: "غير محدد",
          suggestedBudget: "غير محدد"
        }
      }),
      {
        status: 200, // Return 200 with fallback data instead of error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
