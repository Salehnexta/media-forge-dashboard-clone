
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ChartRenderer } from '@/components/visualization/ChartRenderer';
import { useDynamicCharts, ChartRequest } from '@/hooks/useDynamicCharts';

interface DynamicChartsPanelProps {
  charts: ChartRequest[];
  onRemoveChart: (chartId: string) => void;
  onClearAll: () => void;
}

export const DynamicChartsPanel: React.FC<DynamicChartsPanelProps> = ({
  charts,
  onRemoveChart,
  onClearAll
}) => {
  if (charts.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          الرسوم البيانية المطلوبة ({charts.length})
        </CardTitle>
        <Button
          onClick={onClearAll}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          مسح الكل
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {charts.map((chart) => (
          <div key={chart.id} className="relative">
            <Button
              onClick={() => onRemoveChart(chart.id)}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-red-100"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
            
            <div className="bg-white rounded-lg border p-4">
              <ChartRenderer
                config={chart.chart_config}
                data={chart.data}
                className="h-80"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
