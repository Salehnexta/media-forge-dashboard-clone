
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, EngagementMetrics } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EngagementChartProps {
  data: EngagementMetrics[];
  config: ChartConfig;
}

interface ValidatedEngagementMetrics {
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

export const EngagementChart: React.FC<EngagementChartProps> = ({ data, config }) => {
  // Validate and sanitize engagement data
  const validData: ValidatedEngagementMetrics[] = Array.isArray(data) 
    ? data.filter(item => item && typeof item === 'object' && item.platform)
        .map(item => ({
          platform: String(item.platform),
          likes: typeof item.likes === 'number' ? item.likes : 0,
          comments: typeof item.comments === 'number' ? item.comments : 0,
          shares: typeof item.shares === 'number' ? item.shares : 0,
          reach: typeof item.reach === 'number' ? item.reach : 0
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

  // Calculate safe totals
  const totalEngagement = validData.reduce((sum, item) => 
    sum + item.likes + item.comments + item.shares, 0
  );
  
  const averageReach = validData.length > 0 
    ? Math.round(validData.reduce((sum, item) => sum + item.reach, 0) / validData.length)
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" stackId="a" fill="#3b82f6" name="الإعجابات" />
            <Bar dataKey="comments" stackId="a" fill="#10b981" name="التعليقات" />
            <Bar dataKey="shares" stackId="a" fill="#f59e0b" name="المشاركات" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">إجمالي التفاعل</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalEngagement.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">متوسط الوصول</p>
            <p className="text-2xl font-bold text-green-600">
              {averageReach.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
