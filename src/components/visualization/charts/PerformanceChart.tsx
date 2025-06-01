
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceChartProps {
  data: any[];
  config: ChartConfig;
}

interface ValidatedPerformanceData {
  name: string;
  roi: number;
  ctr: number;
  conversions: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, config }) => {
  // Validate and sanitize performance data
  const validData: ValidatedPerformanceData[] = Array.isArray(data)
    ? data.filter(item => item && typeof item === 'object' && item.name)
        .map(item => ({
          name: String(item.name),
          roi: typeof item.roi === 'number' ? item.roi : 0,
          ctr: typeof item.ctr === 'number' ? item.ctr : 0,
          conversions: typeof item.conversions === 'number' ? item.conversions : 0
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

  // Calculate safe metrics
  const bestCampaign = validData.reduce((best, current) => 
    current.roi > best.roi ? current : best, validData[0]
  );

  const averageROI = validData.length > 0 
    ? (validData.reduce((sum, item) => sum + item.roi, 0) / validData.length).toFixed(1)
    : '0.0';

  const totalConversions = validData.reduce((sum, item) => sum + item.conversions, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="roi" fill="#3b82f6" name="العائد على الاستثمار" />
            <Bar dataKey="ctr" fill="#10b981" name="معدل النقر" />
            <Bar dataKey="conversions" fill="#f59e0b" name="التحويلات" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">أفضل حملة</p>
            <p className="text-lg font-bold text-blue-600">
              {bestCampaign?.name || 'غير متوفر'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">متوسط العائد</p>
            <p className="text-lg font-bold text-green-600">
              {averageROI}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">إجمالي التحويلات</p>
            <p className="text-lg font-bold text-amber-600">
              {totalConversions.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
