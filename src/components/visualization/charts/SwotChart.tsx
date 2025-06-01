
import React from 'react';
import { ChartConfig, SwotData } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SwotChartProps {
  data: SwotData;
  config: ChartConfig;
}

export const SwotChart: React.FC<SwotChartProps> = ({ data, config }) => {
  const quadrants = [
    { 
      title: 'نقاط القوة', 
      items: data.strengths || [], 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      titleColor: 'text-green-600'
    },
    { 
      title: 'الفرص', 
      items: data.opportunities || [], 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-600'
    },
    { 
      title: 'نقاط الضعف', 
      items: data.weaknesses || [], 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      titleColor: 'text-yellow-600'
    },
    { 
      title: 'التهديدات', 
      items: data.threats || [], 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      titleColor: 'text-red-600'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 h-96">
          {quadrants.map((quadrant, index) => (
            <div
              key={index}
              className={`${quadrant.bgColor} ${quadrant.borderColor} border-2 rounded-lg p-4 overflow-hidden`}
            >
              <h3 className={`font-bold text-lg mb-3 ${quadrant.titleColor}`}>
                {quadrant.title}
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {quadrant.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`${quadrant.textColor} text-sm p-2 bg-white/60 rounded border`}
                  >
                    • {item}
                  </div>
                ))}
                {quadrant.items.length === 0 && (
                  <p className={`${quadrant.textColor} text-sm opacity-60`}>
                    لا توجد عناصر
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
