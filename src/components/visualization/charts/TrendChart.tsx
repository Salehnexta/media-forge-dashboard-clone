
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendChartProps {
  data: any[];
  config: ChartConfig;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, config }) => {
  const isForecast = config.options?.forecast;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {isForecast ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>نقطة البداية: {data[0]?.date}</span>
          <span>نقطة النهاية: {data[data.length - 1]?.date}</span>
        </div>
      </CardContent>
    </Card>
  );
};
