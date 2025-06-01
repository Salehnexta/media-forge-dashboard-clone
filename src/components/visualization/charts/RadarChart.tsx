
import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { ChartConfig, CompetitorData } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RadarChartProps {
  data: CompetitorData[];
  config: ChartConfig;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, config }) => {
  // Transform data for radar chart
  const radarData = config.options?.axes?.map((axis: string) => {
    const dataPoint: any = { axis };
    data.forEach((competitor, index) => {
      dataPoint[competitor.name] = competitor.metrics[axis] || 0;
    });
    return dataPoint;
  }) || [];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

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
            {data.map((competitor, index) => (
              <Radar
                key={competitor.name}
                name={competitor.name}
                dataKey={competitor.name}
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
