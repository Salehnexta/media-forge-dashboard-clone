
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Wallet, PieChart, Target, TrendingUp, X } from 'lucide-react';

interface BudgetData {
  total_marketing_budget: string;
  monthly_marketing_budget: string;
  budget_allocation: Record<string, number>;
  budget_period: string;
  priority_channels: string[];
  budget_constraints: string;
  expected_roi: string;
}

interface BudgetStepProps {
  budgetData: BudgetData;
  onBudgetDataChange: (data: BudgetData) => void;
}

const marketingChannels = [
  'وسائل التواصل الاجتماعي',
  'إعلانات جوجل',
  'التسويق عبر البريد الإلكتروني',
  'التسويق بالمحتوى',
  'الإعلانات المطبوعة',
  'الراديو والتلفزيون',
  'المعارض والفعاليات',
  'التسويق المؤثر',
  'SEO',
  'العلاقات العامة'
];

const budgetPeriods = [
  { value: 'monthly', label: 'شهرية' },
  { value: 'quarterly', label: 'ربع سنوية' },
  { value: 'annually', label: 'سنوية' }
];

export const BudgetStep = ({ budgetData, onBudgetDataChange }: BudgetStepProps) => {
  const handleInputChange = (field: keyof BudgetData, value: string) => {
    onBudgetDataChange({ ...budgetData, [field]: value });
  };

  const handleAllocationChange = (channel: string, percentage: number) => {
    const newAllocation = { ...budgetData.budget_allocation, [channel]: percentage };
    onBudgetDataChange({ ...budgetData, budget_allocation: newAllocation });
  };

  const addPriorityChannel = (channel: string) => {
    if (!budgetData.priority_channels.includes(channel)) {
      const updatedChannels = [...budgetData.priority_channels, channel];
      onBudgetDataChange({ ...budgetData, priority_channels: updatedChannels });
    }
  };

  const removePriorityChannel = (channel: string) => {
    const updatedChannels = budgetData.priority_channels.filter(c => c !== channel);
    onBudgetDataChange({ ...budgetData, priority_channels: updatedChannels });
  };

  const totalAllocation = Object.values(budgetData.budget_allocation).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الميزانية التسويقية</h2>
        <p className="text-gray-600">حدد ميزانيتك التسويقية لوضع استراتيجية مناسبة لإمكانياتك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wallet className="w-5 h-5 ml-2" />
              الميزانية الإجمالية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="total_marketing_budget">إجمالي الميزانية التسويقية (ريال سعودي)</Label>
              <Input
                id="total_marketing_budget"
                type="number"
                value={budgetData.total_marketing_budget}
                onChange={(e) => handleInputChange('total_marketing_budget', e.target.value)}
                placeholder="50000"
              />
            </div>
            
            <div>
              <Label htmlFor="monthly_marketing_budget">الميزانية الشهرية (ريال سعودي)</Label>
              <Input
                id="monthly_marketing_budget"
                type="number"
                value={budgetData.monthly_marketing_budget}
                onChange={(e) => handleInputChange('monthly_marketing_budget', e.target.value)}
                placeholder="10000"
              />
            </div>

            <div>
              <Label htmlFor="budget_period">فترة الميزانية</Label>
              <Select value={budgetData.budget_period} onValueChange={(value) => handleInputChange('budget_period', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  {budgetPeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 ml-2" />
              العائد المتوقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="expected_roi">العائد على الاستثمار المتوقع (%)</Label>
              <Input
                id="expected_roi"
                type="number"
                step="0.1"
                value={budgetData.expected_roi}
                onChange={(e) => handleInputChange('expected_roi', e.target.value)}
                placeholder="200"
              />
              <p className="text-xs text-gray-500 mt-1">مثال: 200% يعني عائد 2 ريال لكل ريال استثمار</p>
            </div>

            <div>
              <Label htmlFor="budget_constraints">قيود الميزانية</Label>
              <Textarea
                id="budget_constraints"
                value={budgetData.budget_constraints}
                onChange={(e) => handleInputChange('budget_constraints', e.target.value)}
                placeholder="أي قيود أو اعتبارات خاصة بالميزانية..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 ml-2" />
            القنوات ذات الأولوية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>اختر القنوات التسويقية ذات الأولوية:</Label>
            <Select onValueChange={addPriorityChannel}>
              <SelectTrigger>
                <SelectValue placeholder="اختر قناة تسويقية" />
              </SelectTrigger>
              <SelectContent>
                {marketingChannels.map((channel) => (
                  <SelectItem 
                    key={channel} 
                    value={channel}
                    disabled={budgetData.priority_channels.includes(channel)}
                  >
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {budgetData.priority_channels.map((channel) => (
              <Badge key={channel} variant="default" className="flex items-center gap-1">
                {channel}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removePriorityChannel(channel)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <PieChart className="w-5 h-5 ml-2" />
              توزيع الميزانية
            </span>
            <span className="text-sm text-gray-500">
              المجموع: {totalAllocation.toFixed(1)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600 mb-4">
            وزع ميزانيتك على القنوات التسويقية المختلفة (اختياري)
          </p>
          {budgetData.priority_channels.map((channel) => (
            <div key={channel} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{channel}</Label>
                <span className="text-sm font-medium">
                  {budgetData.budget_allocation[channel] || 0}%
                </span>
              </div>
              <Slider
                value={[budgetData.budget_allocation[channel] || 0]}
                onValueChange={(value) => handleAllocationChange(channel, value[0])}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          ))}
          {totalAllocation > 100 && (
            <p className="text-red-500 text-sm">
              تحذير: إجمالي النسب يتجاوز 100%
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
