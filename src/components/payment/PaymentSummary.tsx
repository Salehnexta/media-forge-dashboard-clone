
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PaymentSummaryProps {
  planName: string;
  amount: number;
}

export const PaymentSummary = ({ planName, amount }: PaymentSummaryProps) => {
  const features = planName === 'الباقة المتقدمة' 
    ? [
        'تحليل ذكي متقدم',
        'تحليلات غير محدودة', 
        'تقارير تفصيلية',
        'إدارة الحملات',
        'دعم على مدار الساعة'
      ]
    : planName === 'باقة المؤسسات'
    ? [
        'جميع مميزات الباقة المتقدمة',
        'حلول مخصصة',
        'مدير حساب مختص',
        'تدريب فريق العمل'
      ]
    : [
        'تحليل ذكي أساسي',
        '3 تحليلات شهرياً',
        'تقارير أساسية'
      ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{planName}</span>
          <Badge variant="secondary">شهري</Badge>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">المميزات المشمولة:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>المجموع</span>
            <span>{amount} ريال سعودي</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            يتم التجديد شهرياً تلقائياً
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">
            بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
