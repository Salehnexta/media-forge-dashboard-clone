
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

interface CompletionStepProps {
  analyzing: boolean;
}

export const CompletionStep = ({ analyzing }: CompletionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {analyzing ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : (
            <CheckCircle className="w-10 h-10 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {analyzing ? 'جاري التحليل الشامل...' : 'تم إكمال التحليل! 🎉'}
        </h2>
        <p className="text-gray-600">
          {analyzing 
            ? 'نحن نحلل جميع البيانات والملفات باستخدام أحدث تقنيات الذكاء الاصطناعي'
            : 'مرحباً بك في Morvo! ستجد التحليل المفصل والتوصيات في لوحة التحكم'
          }
        </p>
      </div>
      
      {analyzing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center text-blue-800">
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>تحليل بيانات الشركة والسوق...</span>
              </div>
              <div className="flex items-center text-blue-800">
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>معالجة بيانات المبيعات والميزانية...</span>
              </div>
              <div className="flex items-center text-blue-800">
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>تحليل الملفات المرفوعة...</span>
              </div>
              <div className="flex items-center text-blue-800">
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>إنشاء التوصيات المخصصة...</span>
              </div>
              <div className="flex items-center text-blue-800">
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                <span>إعداد لوحة التحكم الشخصية...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
