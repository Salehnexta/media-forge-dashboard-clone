
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_CUSTOM_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
}

const generateEmailTemplate = (emailData: EmailData, userEmail: string) => {
  const { token_hash, email_action_type, redirect_to } = emailData;
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد حسابك في Morvo</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          direction: rtl;
        }
        .header {
          text-align: center;
          padding: 40px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px 10px 0 0;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .content {
          padding: 40px 30px;
          background: #ffffff;
          border: 1px solid #e1e5e9;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
          background: #f8f9fa;
          border-radius: 0 0 10px 10px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Morvo</div>
        <p>منصة التسويق الذكية المدعومة بالذكاء الاصطناعي</p>
      </div>
      
      <div class="content">
        <h2>مرحباً بك في Morvo! 🎉</h2>
        
        <p>شكراً لك على التسجيل في منصة Morvo للتسويق الذكي. لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:</p>
        
        <div style="text-align: center;">
          <a href="${verifyUrl}" class="button">
            تأكيد البريد الإلكتروني
          </a>
        </div>
        
        <p>أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
        <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 6px; font-size: 14px;">
          ${verifyUrl}
        </p>
        
        <div class="warning">
          <strong>مهم:</strong> هذا الرابط صالح لمدة محدودة. إذا لم تكن قد طلبت إنشاء حساب، يمكنك تجاهل هذه الرسالة بأمان.
        </div>
        
        <h3>ماذا ينتظرك في Morvo؟</h3>
        <ul>
          <li>📊 تحليلات متقدمة للحملات التسويقية</li>
          <li>🤖 مساعد ذكي لإنشاء المحتوى</li>
          <li>📈 تتبع الأداء في الوقت الفعلي</li>
          <li>🎯 استهداف دقيق للجمهور</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>هذه الرسالة مرسلة من منصة Morvo</p>
        <p>إذا كان لديك أي استفسار، لا تتردد في <a href="mailto:support@morvo.ai">التواصل معنا</a></p>
        <p style="font-size: 12px; color: #999;">
          Morvo AI Marketing Platform - جميع الحقوق محفوظة © 2024
        </p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Custom email function called');
    
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Verify webhook signature if secret is configured
    if (hookSecret) {
      const wh = new Webhook(hookSecret);
      const data = wh.verify(payload, headers) as {
        user: { email: string };
        email_data: EmailData;
      };
      
      const { user, email_data } = data;
      console.log('Processing email for:', user.email);
      
      const htmlContent = generateEmailTemplate(email_data, user.email);
      
      const { data: emailResult, error } = await resend.emails.send({
        from: 'Morvo <noreply@morvo.ai>',
        to: [user.email],
        subject: 'تأكيد حسابك في Morvo - أهلاً بك! 🚀',
        html: htmlContent,
      });

      if (error) {
        console.error('Resend error:', error);
        throw error;
      }

      console.log('Email sent successfully:', emailResult);
      
      return new Response(JSON.stringify({ success: true, emailResult }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } else {
      // Fallback for development without webhook secret
      console.log('No webhook secret configured, processing basic email');
      
      const body = JSON.parse(payload);
      const { user, email_data } = body;
      
      const htmlContent = generateEmailTemplate(email_data, user.email);
      
      const { data: emailResult, error } = await resend.emails.send({
        from: 'Morvo <noreply@morvo.ai>',
        to: [user.email],
        subject: 'تأكيد حسابك في Morvo - أهلاً بك! 🚀',
        html: htmlContent,
      });

      if (error) {
        console.error('Resend error:', error);
        throw error;
      }

      console.log('Email sent successfully:', emailResult);
      
      return new Response(JSON.stringify({ success: true, emailResult }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  } catch (error: any) {
    console.error('Error in send-custom-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send custom email'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
