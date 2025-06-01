
import React from 'react';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FunnelChartProps {
  data: any[];
  config: ChartConfig;
}

interface ValidatedFunnelData {
  name: string;
  value: number;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data, config }) => {
  // Validate and sanitize funnel data
  const validData: ValidatedFunnelData[] = Array.isArray(data)
    ? data.filter(item => item && typeof item === 'object' && item.name)
        .map(item => ({
          name: String(item.name),
          value: typeof item.value === 'number' && item.value >= 0 ? item.value : 0
        }))
    : [];

  // Handle empty data
  if (validData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            لا توجد بيانات للعرض
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...validData.map(item => item.value));
  
  // Prevent division by zero
  if (maxValue === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            جميع القيم صفر
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate conversion metrics safely
  const totalConversionRate = validData.length > 1 && validData[0].value > 0
    ? ((validData[validData.length - 1].value / validData[0].value) * 100).toFixed(1)
    : '0.0';

  const biggestDrop = validData.reduce((biggest, current, index) => {
    if (index === 0) return biggest;
    const previousValue = validData[index - 1].value;
    if (previousValue === 0) return biggest;
    
    const dropRate = ((previousValue - current.value) / previousValue) * 100;
    return dropRate > biggest.rate ? { stage: current.name, rate: dropRate } : biggest;
  }, { stage: '', rate: 0 });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {validData.map((stage, index) => {
            const percentage = (stage.value / maxValue) * 100;
            const conversionRate = index > 0 && validData[index - 1].value > 0
              ? ((stage.value / validData[index - 1].value) * 100).toFixed(1)
              : '100.0';
            
            return (
              <div key={stage.name} className="relative">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    width: `${Math.max(percentage, 20)}%`,
                    marginLeft: `${(100 - Math.max(percentage, 20)) / 2}%`
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{stage.name}</span>
                    <span className="text-lg font-bold">{stage.value.toLocaleString()}</span>
                  </div>
                  {index > 0 && (
                    <div className="text-xs mt-1 opacity-90">
                      معدل التحويل: {conversionRate}%
                    </div>
                  )}
                </div>
                
                {index < validData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">معدل التحويل الإجمالي</p>
            <p className="text-2xl font-bold text-blue-600">{totalConversionRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">أكبر نقطة تسرب</p>
            <p className="text-lg font-bold text-red-600">
              {biggestDrop.stage || 'غير متوفر'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
