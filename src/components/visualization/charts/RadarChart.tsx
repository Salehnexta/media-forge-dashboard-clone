
import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { ChartConfig, CompetitorData } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RadarChartProps {
  data: CompetitorData[];
  config: ChartConfig;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, config }) => {
  // Validate input data
  const validData: CompetitorData[] = Array.isArray(data) ? data : [];
  const validAxes = Array.isArray(config.options?.axes) ? config.options.axes : [];
  
  // Transform data for radar chart with validation
  const radarData = validAxes.map((axis: string) => {
    const dataPoint: any = { axis };
    validData.forEach((competitor) => {
      if (competitor && competitor.metrics && typeof competitor.metrics === 'object') {
        dataPoint[competitor.name] = competitor.metrics[axis] || 0;
      }
    });
    return dataPoint;
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  // Handle empty data gracefully
  if (validData.length === 0 || validAxes.length === 0) {
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
          <RechartsRadar data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="axis" className="text-sm" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
            {validData.map((competitor, index) => (
              <Radar
                key={competitor.name || `competitor-${index}`}
                name={competitor.name || `منافس ${index + 1}`}
                dataKey={competitor.name || `competitor-${index}`}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            <Legend />
          </RechartsRadar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
