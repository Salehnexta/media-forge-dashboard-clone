
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedSmartOnboarding } from '../onboarding/EnhancedSmartOnboarding';
import { RefreshCw, Brain, Plus } from 'lucide-react';

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
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-900">
          <Brain className="w-5 h-5 ml-2" />
          إضافة شركة جديدة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          هل تريد إضافة شركة جديدة أو تحديث التحليل الحالي باستخدام الذكاء الاصطناعي؟
        </p>
        <div className="space-y-3">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full">
                <Plus className="w-4 h-4 ml-2" />
                إضافة شركة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
              <EnhancedSmartOnboarding user={user} onComplete={handleComplete} />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث التحليل الحالي
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
