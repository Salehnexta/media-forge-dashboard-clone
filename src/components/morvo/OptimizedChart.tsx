
import React, { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OptimizedChartProps {
  data: any[];
  title: string;
  dataKey: string;
  color?: string;
  height?: number;
}

export const OptimizedChart = memo<OptimizedChartProps>(({ 
  data, 
  title, 
  dataKey, 
  color = '#3b82f6',
  height = 300 
}) => {
  const chartOptions = useMemo(() => ({
    animationDuration: 300,
    animationEasing: 'ease-out'
  }), []);

  const processedData = useMemo(() => {
    // Limit data points for better performance
    return data.slice(-20);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            animationDuration={chartOptions.animationDuration}
            animationEasing={chartOptions.animationEasing}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';
