
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendChartProps {
  data: any[];
  config: ChartConfig;
}

interface TrendDataPoint {
  date: string;
  value?: number;
  actual?: number;
  forecast?: number;
  [key: string]: any;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, config }) => {
  const isForecast = config.options?.forecast;
  
  // Validate and type the input data
  const validData: TrendDataPoint[] = Array.isArray(data) ? data.filter(
    item => item && typeof item === 'object' && item.date
  ) : [];
  
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
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {isForecast ? (
            <AreaChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="البيانات الفعلية"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeDasharray="5 5"
                name="التوقع"
              />
            </AreaChart>
          ) : (
            <LineChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="القيمة"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
        
        {validData.length > 0 && (
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>نقطة البداية: {validData[0]?.date || 'غير متوفر'}</span>
            <span>نقطة النهاية: {validData[validData.length - 1]?.date || 'غير متوفر'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
