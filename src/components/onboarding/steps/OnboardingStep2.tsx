
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Users, DollarSign } from 'lucide-react';
import { OnboardingData } from '../EnhancedSmartOnboarding';

interface OnboardingStep2Props {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
}

const primaryGoalsOptions = [
  'زيادة الوعي بالعلامة التجارية',
  'توليد العملاء المحتملين',
  'زيادة المبيعات',
  'الاحتفاظ بالعملاء',
  'توسيع النطاق الجغرافي',
  'إطلاق منتجات جديدة'
];

const keyKPIsOptions = [
  'زيارات الموقع',
  'التفاعل على وسائل التواصل',
  'معدل فتح الإيميل',
  'معدل التحويل',
  'عائد الإنفاق الإعلاني',
  'ذكر العلامة التجارية'
];

export const OnboardingStep2 = ({ data, onDataChange }: OnboardingStep2Props) => {
  const handleGoalToggle = (goal: string) => {
    const newGoals = data.primaryGoals.includes(goal as any)
      ? data.primaryGoals.filter(g => g !== goal)
      : [...data.primaryGoals, goal as any];
    onDataChange({ primaryGoals: newGoals });
  };

  const handleKPIToggle = (kpi: string) => {
    const newKPIs = data.keyKPIs.includes(kpi as any)
      ? data.keyKPIs.filter(k => k !== kpi)
      : [...data.keyKPIs, kpi as any];
    onDataChange({ keyKPIs: newKPIs });
  };

  return (
    <div className="space-y-6">
      {/* فريق التسويق والميزانية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            فريق التسويق والميزانية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="teamSize">حجم فريق التسويق</Label>
              <Select value={data.teamSize} onValueChange={(value: any) => onDataChange({ teamSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أنا فقط">أنا فقط</SelectItem>
                  <SelectItem value="2-5 أشخاص">2-5 أشخاص</SelectItem>
                  <SelectItem value="6-10 أشخاص">6-10 أشخاص</SelectItem>
                  <SelectItem value="10+ أشخاص">10+ أشخاص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experienceLevel">مستوى الخبرة</Label>
              <Select value={data.experienceLevel} onValueChange={(value: any) => onDataChange({ experienceLevel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="متقدم">متقدم</SelectItem>
                  <SelectItem value="خبير">خبير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monthlyBudget">الميزانية الشهرية</Label>
              <Select value={data.monthlyBudget} onValueChange={(value: any) => onDataChange({ monthlyBudget: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أقل من 5000 ريال">أقل من 5000 ريال</SelectItem>
                  <SelectItem value="5000-15000 ريال">5000-15000 ريال</SelectItem>
                  <SelectItem value="15000-50000 ريال">15000-50000 ريال</SelectItem>
                  <SelectItem value="50000+ ريال">50000+ ريال</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أهداف التسويق */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            أهداف التسويق الأساسية *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryGoalsOptions.map((goal) => (
              <div key={goal} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={goal}
                  checked={data.primaryGoals.includes(goal as any)}
                  onCheckedChange={() => handleGoalToggle(goal)}
                />
                <Label htmlFor={goal} className="text-sm font-normal cursor-pointer">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
          
          {data.primaryGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">الأهداف المختارة:</span>
              {data.primaryGoals.map((goal) => (
                <Badge key={goal} variant="secondary" className="text-xs">
                  {goal}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* مؤشرات الأداء الرئيسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            مؤشرات الأداء الرئيسية (KPIs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyKPIsOptions.map((kpi) => (
              <div key={kpi} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={kpi}
                  checked={data.keyKPIs.includes(kpi as any)}
                  onCheckedChange={() => handleKPIToggle(kpi)}
                />
                <Label htmlFor={kpi} className="text-sm font-normal cursor-pointer">
                  {kpi}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* استراتيجية الحملات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            استراتيجية الحملات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="campaignFrequency">تكرار الحملات</Label>
              <Select value={data.campaignFrequency} onValueChange={(value: any) => onDataChange({ campaignFrequency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أسبوعياً">أسبوعياً</SelectItem>
                  <SelectItem value="كل أسبوعين">كل أسبوعين</SelectItem>
                  <SelectItem value="شهرياً">شهرياً</SelectItem>
                  <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                  <SelectItem value="حسب الحاجة">حسب الحاجة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="automationLevel">مستوى الأتمتة</Label>
              <Select value={data.automationLevel} onValueChange={(value: any) => onDataChange({ automationLevel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أتمتة كاملة">أتمتة كاملة</SelectItem>
                  <SelectItem value="أتمتة جزئية">أتمتة جزئية</SelectItem>
                  <SelectItem value="مراجعة يدوية">مراجعة يدوية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="approvalWorkflow">سير عمل الموافقة</Label>
              <Select value={data.approvalWorkflow} onValueChange={(value: any) => onDataChange({ approvalWorkflow: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نشر تلقائي">نشر تلقائي</SelectItem>
                  <SelectItem value="موافقة سريعة">موافقة سريعة</SelectItem>
                  <SelectItem value="موافقة الفريق">موافقة الفريق</SelectItem>
                  <SelectItem value="موافقة العميل">موافقة العميل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
