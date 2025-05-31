
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentSummary } from '@/components/payment/PaymentSummary';
import { PageLayout } from '@/components/layout/PageLayout';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const planName = searchParams.get('plan') || 'الباقة الأساسية';
  const amount = Number(searchParams.get('amount')) || 0;

  const handlePayment = async (paymentData: any) => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "خطأ",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('moyasar-payment', {
        body: {
          amount,
          currency: 'SAR',
          description: `اشتراك في ${planName}`,
          source: {
            type: 'creditcard',
            name: paymentData.cardName,
            number: paymentData.cardNumber.replace(/\s/g, ''),
            cvc: paymentData.cvc,
            month: paymentData.expiryMonth,
            year: paymentData.expiryYear
          },
          metadata: {
            plan_name: planName,
            plan_type: 'subscription'
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "تم الدفع بنجاح!",
          description: `تم تفعيل اشتراكك في ${planName}`,
        });
        navigate('/dashboard');
      } else {
        throw new Error(data.error || 'حدث خطأ في الدفع');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "فشل في الدفع",
        description: error.message || "حدث خطأ أثناء معالجة الدفعة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="إتمام الدفع"
      description="أكمل عملية الدفع لتفعيل اشتراكك"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الأسعار", href: "/pricing" },
        { label: "الدفع" }
      ]}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <PaymentSummary 
            planName={planName}
            amount={amount}
          />
          <PaymentForm 
            onSubmit={handlePayment}
            loading={loading}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
