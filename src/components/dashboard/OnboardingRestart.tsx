
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedSmartOnboarding } from '../onboarding/EnhancedSmartOnboarding';
import { RefreshCw, Brain, Plus, Building2, Sparkles } from 'lucide-react';

interface OnboardingRestartProps {
  user: User;
}

export const OnboardingRestart = ({ user }: OnboardingRestartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = () => {
    setIsOpen(false);
    window.location.reload(); // تحديث الصفحة لإظهار البيانات الجديدة
  };

  return (
    <div className="space-y-6">
      {/* Card for adding new company */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Building2 className="w-6 h-6 ml-2" />
            إضافة شركة جديدة
          </CardTitle>
          <p className="text-blue-700 text-sm">
            ابدأ تحليل شركة جديدة بالذكاء الاصطناعي واحصل على استراتيجية تسويقية مخصصة
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 ml-2" />
                لماذا تحتاج شركة جديدة؟
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                  إدارة عدة أعمال مختلفة
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                  تجربة منتج أو خدمة جديدة
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                  تحليل منافس أو شريك محتمل
                </li>
              </ul>
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full">
                  <Plus className="w-4 h-4 ml-2" />
                  ابدأ تحليل شركة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
                <EnhancedSmartOnboarding user={user} onComplete={handleComplete} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Card for updating current analysis */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-900">
            <Brain className="w-6 h-6 ml-2" />
            تحديث التحليل الحالي
          </CardTitle>
          <p className="text-green-700 text-sm">
            احصل على تحليل محدث لشركتك الحالية باستخدام أحدث البيانات
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">ما الجديد في التحديث؟</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full ml-2"></div>
                  تحليل جديد للمنافسين
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full ml-2"></div>
                  اتجاهات السوق المحدثة
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full ml-2"></div>
                  فرص تسويقية جديدة
                </li>
              </ul>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث التحليل الحالي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
