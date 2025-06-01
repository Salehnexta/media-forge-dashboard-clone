
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartConfig, SentimentData } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SentimentChartProps {
  data: SentimentData;
  config: ChartConfig;
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data, config }) => {
  const chartData = [
    { name: 'إيجابي', value: data.positive, color: '#22c55e' },
    { name: 'محايد', value: data.neutral, color: '#64748b' },
    { name: 'سلبي', value: data.negative, color: '#ef4444' }
  ];

  const renderLabel = (entry: any) => {
    const percentage = ((entry.value / (data.positive + data.neutral + data.negative)) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [value, 'العدد']}
              labelFormatter={(label) => label}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {chartData.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              <div
                className="w-4 h-4 rounded-full mb-1"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-lg font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
