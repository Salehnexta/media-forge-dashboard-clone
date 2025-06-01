
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceChartProps {
  data: any[];
  config: ChartConfig;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, config }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              {data.reduce((best, current) => 
                current.roi > best.roi ? current : best, data[0] || {})?.name || 'غير متوفر'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">متوسط العائد</p>
            <p className="text-lg font-bold text-green-600">
              {data.length > 0 ? 
                `${(data.reduce((sum, item) => sum + item.roi, 0) / data.length).toFixed(1)}%` : 
                '0%'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">إجمالي التحويلات</p>
            <p className="text-lg font-bold text-amber-600">
              {data.reduce((sum, item) => sum + item.conversions, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
