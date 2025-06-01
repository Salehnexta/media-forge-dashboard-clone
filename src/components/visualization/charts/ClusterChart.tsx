
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClusterChartProps {
  data: any[];
  config: ChartConfig;
}

interface ClusterPoint {
  x: number;
  y: number;
  cluster?: number;
  [key: string]: any;
}

export const ClusterChart: React.FC<ClusterChartProps> = ({ data, config }) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  // Group data by cluster with proper typing
  const clusters = data.reduce((acc: Record<number, ClusterPoint[]>, point: ClusterPoint) => {
    const clusterId = point.cluster || 0;
    if (!acc[clusterId]) acc[clusterId] = [];
    acc[clusterId].push(point);
    return acc;
  }, {} as Record<number, ClusterPoint[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="المحور X" 
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="المحور Y" 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => [value, name === 'x' ? 'المحور X' : 'المحور Y']}
              labelFormatter={() => ''}
            />
            <Legend />
            
            {Object.entries(clusters).map(([clusterId, points], index) => (
              <Scatter
                key={clusterId}
                name={`المجموعة ${parseInt(clusterId) + 1}`}
                data={points}
                fill={colors[index % colors.length]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">عدد المجموعات</p>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(clusters).length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">إجمالي النقاط</p>
            <p className="text-2xl font-bold text-green-600">{data.length}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {Object.entries(clusters).map(([clusterId, points], index) => (
            <div key={clusterId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm font-medium">المجموعة {parseInt(clusterId) + 1}</span>
              </div>
              <span className="text-sm text-gray-600">{points.length} نقطة</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
