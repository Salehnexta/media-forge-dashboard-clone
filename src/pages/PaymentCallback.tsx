
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  
  const paymentId = searchParams.get('id');
  const paymentStatus = searchParams.get('status');

  useEffect(() => {
    // Simulate checking payment status
    const timer = setTimeout(() => {
      if (paymentStatus === 'paid') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [paymentStatus]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2">جاري التحقق من الدفعة...</h2>
            <p className="text-gray-600">يرجى الانتظار بينما نتأكد من حالة دفعتك</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2 text-green-800">تم الدفع بنجاح!</h2>
            <p className="text-gray-600 mb-6">
              تم تفعيل اشتراكك بنجاح. يمكنك الآن الاستفادة من جميع المميزات.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/dashboard">الذهاب إلى لوحة التحكم</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/pricing">عرض الباقات</Link>
              </Button>
            </div>
          </div>
        );
      
      case 'failed':
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-2 text-red-800">فشل في الدفع</h2>
            <p className="text-gray-600 mb-6">
              لم نتمكن من معالجة دفعتك. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/pricing">إعادة المحاولة</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/contact">تواصل مع الدعم</Link>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <PageLayout
      title="نتيجة الدفع"
      description="نتيجة عملية الدفع"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الدفع" }
      ]}
    >
      <div className="container mx-auto px-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">حالة الدفعة</CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
            {paymentId && (
              <div className="mt-6 p-3 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">
                  رقم المعاملة: {paymentId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PaymentCallback;
