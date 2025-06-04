
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Metric {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
      {metrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                {metric.change && (
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3 text-green-600" />
                    ) : metric.trend === 'down' ? (
                      <ArrowDown className="w-3 h-3 text-red-600" />
                    ) : null}
                    <p className={`text-xs lg:text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change}
                    </p>
                  </div>
                )}
              </div>
              <div className={`bg-gradient-to-r ${metric.color} p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
