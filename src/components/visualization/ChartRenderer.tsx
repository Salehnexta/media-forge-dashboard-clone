
import React from 'react';
import { ChartConfig } from '@/types/visualization';
import { SwotChart } from './charts/SwotChart';
import { RadarChart } from './charts/RadarChart';
import { TrendChart } from './charts/TrendChart';
import { SentimentChart } from './charts/SentimentChart';
import { EngagementChart } from './charts/EngagementChart';
import { PerformanceChart } from './charts/PerformanceChart';
import { FunnelChart } from './charts/FunnelChart';
import { TimelineChart } from './charts/TimelineChart';
import { BulletChart } from './charts/BulletChart';
import { ForecastChart } from './charts/ForecastChart';
import { ClusterChart } from './charts/ClusterChart';
import { Card, CardContent } from '@/components/ui/card';

interface ChartRendererProps {
  config: ChartConfig;
  data: any;
  className?: string;
  onExport?: (format: 'png' | 'pdf' | 'html') => void;
}

// Error boundary component for chart rendering
const ChartErrorBoundary: React.FC<{ 
  children: React.ReactNode; 
  chartType: string;
  onError?: (error: Error) => void;
}> = ({ children, chartType, onError }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error(`Chart rendering error for ${chartType}:`, error);
      setHasError(true);
      onError?.(new Error(error.message));
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [chartType, onError]);

  if (hasError) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">خطأ في عرض الرسم البياني</p>
            <p className="text-sm text-gray-500 mt-1">نوع الرسم: {chartType}</p>
            <button 
              onClick={() => setHasError(false)}
              className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              إعادة المحاولة
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  data,
  className = "",
  onExport
}) => {
  // Validate config object
  const validConfig: ChartConfig = {
    type: config?.type || 'line',
    title: config?.title || 'رسم بياني',
    data: config?.data,
    options: config?.options || {},
    theme: config?.theme || 'light',
    rtl: config?.rtl !== false // Default to true for Arabic
  };

  const handleChartError = React.useCallback((error: Error) => {
    console.error('Chart rendering failed:', error);
  }, []);

  const renderChart = () => {
    try {
      switch (validConfig.type) {
        case 'quadrant':
          return <SwotChart data={data} config={validConfig} />;
        case 'radar':
          return <RadarChart data={data} config={validConfig} />;
        case 'line':
          return <TrendChart data={data} config={validConfig} />;
        case 'donut':
          return <SentimentChart data={data} config={validConfig} />;
        case 'stackedBar':
          return <EngagementChart data={data} config={validConfig} />;
        case 'column':
          return <PerformanceChart data={data} config={validConfig} />;
        case 'funnel':
          return <FunnelChart data={data} config={validConfig} />;
        case 'timeline':
          return <TimelineChart data={data} config={validConfig} />;
        case 'bullet':
          return <BulletChart data={data} config={validConfig} />;
        case 'forecast':
          return <ForecastChart data={data} config={validConfig} />;
        case 'cluster':
          return <ClusterChart data={data} config={validConfig} />;
        case 'treemap':
        case 'sankey':
        case 'network':
        case 'heatmap':
        case 'bubble':
          return (
            <Card className="w-full">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-blue-500 mb-2">🚧</div>
                  <p className="text-gray-600">نوع الرسم البياني قيد التطوير</p>
                  <p className="text-sm text-gray-500 mt-1">{validConfig.type}</p>
                </div>
              </CardContent>
            </Card>
          );
        default:
          return (
            <Card className="w-full">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-orange-500 mb-2">❓</div>
                  <p className="text-gray-600">نوع الرسم البياني غير مدعوم</p>
                  <p className="text-sm text-gray-500 mt-1">{validConfig.type}</p>
                </div>
              </CardContent>
            </Card>
          );
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return (
        <Card className="w-full">
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-gray-600">خطأ في عرض الرسم البياني</p>
              <p className="text-sm text-gray-500 mt-1">
                {error instanceof Error ? error.message : 'خطأ غير معروف'}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className={`relative ${className}`} dir="rtl">
      <ChartErrorBoundary 
        chartType={validConfig.type} 
        onError={handleChartError}
      >
        <div className="chart-container">
          {renderChart()}
        </div>
      </ChartErrorBoundary>
      
      {onExport && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onExport('png')}
            className="px-2 py-1 text-xs bg-white border rounded shadow hover:bg-gray-50 transition-colors"
          >
            PNG
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="px-2 py-1 text-xs bg-white border rounded shadow hover:bg-gray-50 transition-colors"
          >
            PDF
          </button>
          <button
            onClick={() => onExport('html')}
            className="px-2 py-1 text-xs bg-white border rounded shadow hover:bg-gray-50 transition-colors"
          >
            HTML
          </button>
        </div>
      )}
    </div>
  );
};
