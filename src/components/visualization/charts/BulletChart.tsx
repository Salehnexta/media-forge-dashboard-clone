
import React from 'react';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BulletChartProps {
  data: any[];
  config: ChartConfig;
}

export const BulletChart: React.FC<BulletChartProps> = ({ data, config }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((metric, index) => {
            const percentage = (metric.current / metric.target) * 100;
            const isOverTarget = percentage > 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{metric.name}</span>
                  <span className="text-sm text-gray-600">
                    {metric.current} / {metric.target}
                  </span>
                </div>
                
                <div className="relative">
                  {/* Background bar */}
                  <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                    {/* Poor performance zone */}
                    <div 
                      className="absolute h-full bg-red-200"
                      style={{ width: '60%' }}
                    ></div>
                    {/* Good performance zone */}
                    <div 
                      className="absolute h-full bg-yellow-200"
                      style={{ left: '60%', width: '30%' }}
                    ></div>
                    {/* Excellent performance zone */}
                    <div 
                      className="absolute h-full bg-green-200"
                      style={{ left: '90%', width: '10%' }}
                    ></div>
                    
                    {/* Current value bar */}
                    <div 
                      className={`absolute h-full ${
                        isOverTarget ? 'bg-green-600' : 
                        percentage >= 90 ? 'bg-green-500' :
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      } transition-all duration-300`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                    
                    {/* Target line */}
                    <div 
                      className="absolute h-full w-1 bg-black"
                      style={{ left: '100%', transform: 'translateX(-2px)' }}
                    ></div>
                  </div>
                  
                  {/* Percentage indicator */}
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                    <span>0</span>
                    <span className={`font-bold ${
                      isOverTarget ? 'text-green-600' : 
                      percentage >= 90 ? 'text-green-500' :
                      percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                    <span>الهدف</span>
                  </div>
                </div>
                
                {metric.previousPeriod && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>الفترة السابقة: {metric.previousPeriod}</span>
                    <span className={`${
                      metric.current > metric.previousPeriod ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ({metric.current > metric.previousPeriod ? '+' : ''}
                      {((metric.current - metric.previousPeriod) / metric.previousPeriod * 100).toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
