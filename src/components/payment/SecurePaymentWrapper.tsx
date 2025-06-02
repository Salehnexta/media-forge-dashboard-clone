
import React from 'react';
import { SecurePaymentForm } from '@/components/security/SecurePaymentForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export const SecurePaymentWrapper: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handlePaymentSubmit = async (data: PaymentData) => {
    setLoading(true);
    
    try {
      // Call secure payment edge function
      const { data: paymentResult, error } = await supabase.functions.invoke('moyasar-payment', {
        body: {
          amount: Math.round(data.amount * 100), // Convert to halalas
          currency: data.currency,
          description: data.description,
          callback_url: `${window.location.origin}/payment/callback`,
          source: {
            type: "creditcard"
          },
          metadata: {
            customer_name: data.customerInfo.name,
            customer_email: data.customerInfo.email,
            customer_phone: data.customerInfo.phone
          }
        }
      });

      if (error) {
        console.error('Payment error:', error);
        throw new Error('فشل في معالجة الدفع');
      }

      if (paymentResult?.id) {
        // Redirect to Moyasar payment page
        window.location.href = `https://api.moyasar.com/v1/payments/${paymentResult.id}/source`;
      } else {
        throw new Error('لم يتم إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الدفع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الدفع الآمن</h1>
          <p className="text-gray-600">نستخدم أحدث تقنيات الأمان لحماية بياناتك</p>
        </div>
        
        <SecurePaymentForm 
          onPaymentSubmit={handlePaymentSubmit}
          loading={loading}
        />
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>SSL مؤمن</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>PCI متوافق</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>مشفر 256-bit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
