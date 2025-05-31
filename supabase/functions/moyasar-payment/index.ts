
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number
  currency: string
  description: string
  source: {
    type: string
    name: string
    number: string
    cvc: string
    month: string
    year: string
  }
  callback_url?: string
  metadata?: Record<string, any>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { amount, currency = 'SAR', description, source, metadata } = await req.json() as PaymentRequest

    // Get Moyasar secret key
    const moyasarSecretKey = Deno.env.get('MOYASAR_SECRET_KEY')
    if (!moyasarSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Moyasar configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare payment data for Moyasar
    const paymentData = {
      amount: amount * 100, // Convert to halalas (smallest currency unit)
      currency,
      description,
      source,
      callback_url: `${req.headers.get('origin')}/payment-callback`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
        ...metadata
      }
    }

    console.log('Processing payment for user:', user.id, 'amount:', amount)

    // Make payment request to Moyasar
    const moyasarResponse = await fetch('https://api.moyasar.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(moyasarSecretKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const paymentResult = await moyasarResponse.json()

    console.log('Moyasar response:', paymentResult)

    if (!moyasarResponse.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Payment failed', 
          details: paymentResult 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store payment record in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        payment_id: paymentResult.id,
        amount: amount,
        currency,
        status: paymentResult.status,
        description,
        metadata: paymentResult
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: paymentResult
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
