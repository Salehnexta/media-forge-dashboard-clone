
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SmartOnboarding } from '../onboarding/SmartOnboarding';
import { RefreshCw, Brain } from 'lucide-react';

interface OnboardingRestartProps {
  user: User;
}

export const OnboardingRestart = ({ user }: OnboardingRestartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = () => {
    setIsOpen(false);
    window.location.reload(); // Refresh to show new data
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-900">
          <Brain className="w-5 h-5 ml-2" />
          تحليل ذكي جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          هل تريد إضافة شركة جديدة أو تحديث التحليل الحالي؟
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <RefreshCw className="w-4 h-4 ml-2" />
              بدء تحليل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <SmartOnboarding user={user} onComplete={handleComplete} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
