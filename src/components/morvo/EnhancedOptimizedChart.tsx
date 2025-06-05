
import React, { memo, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useComponentPerformance } from '@/hooks/useEnhancedPerformance';

interface EnhancedOptimizedChartProps {
  data: any[];
  title: string;
  dataKey: string;
  color?: string;
  height?: number;
  type?: 'line' | 'bar';
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  maxDataPoints?: number;
}

const EnhancedOptimizedChart = memo<EnhancedOptimizedChartProps>(({ 
  data, 
  title, 
  dataKey, 
  color = '#3b82f6',
  height = 300,
  type = 'line',
  showGrid = true,
  showTooltip = true,
  animate = true,
  maxDataPoints = 50
}) => {
  useComponentPerformance(`EnhancedOptimizedChart-${title}`);

  // Optimize data - limit points and memoize
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Limit data points for better performance
    const limitedData = data.slice(-maxDataPoints);
    
    // Ensure data has required fields
    return limitedData.map((item, index) => ({
      name: item.name || item.label || `نقطة ${index + 1}`,
      [dataKey]: typeof item[dataKey] === 'number' ? item[dataKey] : 0,
      ...item
    }));
  }, [data, dataKey, maxDataPoints]);

  // Memoized chart configuration for better performance
  const chartConfig = useMemo(() => ({
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    animationDuration: animate ? 300 : 0
  }), [animate]);

  // Custom tooltip formatter
  const tooltipFormatter = useCallback((value: any, name: string) => [
    typeof value === 'number' ? value.toLocaleString('ar-SA') : value,
    name
  ], []);

  // Custom label formatter
  const labelFormatter = useCallback((label: string) => `التصنيف: ${label}`, []);

  // Render appropriate chart type
  const renderChart = useCallback(() => {
    const commonProps = {
      data: processedData,
      margin: chartConfig.margin,
      ...chartConfig
    };

    if (type === 'bar') {
      return (
        <BarChart {...commonProps}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip 
              formatter={tooltipFormatter}
              labelFormatter={labelFormatter}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                direction: 'rtl'
              }}
            />
          )}
          <Bar 
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            animationDuration={chartConfig.animationDuration}
          />
        </BarChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
        <XAxis 
          dataKey="name" 
          stroke="#64748b"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748b"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        {showTooltip && (
          <Tooltip 
            formatter={tooltipFormatter}
            labelFormatter={labelFormatter}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              direction: 'rtl'
            }}
          />
        )}
        <Line 
          type="monotone" 
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          animationDuration={chartConfig.animationDuration}
          connectNulls={false}
        />
      </LineChart>
    );
  }, [processedData, chartConfig, type, showGrid, showTooltip, dataKey, color, tooltipFormatter, labelFormatter]);

  // Show empty state if no data
  if (!processedData || processedData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>لا توجد بيانات للعرض</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

EnhancedOptimizedChart.displayName = 'EnhancedOptimizedChart';

export { EnhancedOptimizedChart };
