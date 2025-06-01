
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

interface ChartRendererProps {
  config: ChartConfig;
  data: any;
  className?: string;
  onExport?: (format: 'png' | 'pdf' | 'html') => void;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  data,
  className = "",
  onExport
}) => {
  const renderChart = () => {
    switch (config.type) {
      case 'quadrant':
        return <SwotChart data={data} config={config} />;
      case 'radar':
        return <RadarChart data={data} config={config} />;
      case 'line':
        return <TrendChart data={data} config={config} />;
      case 'donut':
        return <SentimentChart data={data} config={config} />;
      case 'stackedBar':
        return <EngagementChart data={data} config={config} />;
      case 'column':
        return <PerformanceChart data={data} config={config} />;
      case 'funnel':
        return <FunnelChart data={data} config={config} />;
      case 'timeline':
        return <TimelineChart data={data} config={config} />;
      case 'bullet':
        return <BulletChart data={data} config={config} />;
      case 'forecast':
        return <ForecastChart data={data} config={config} />;
      case 'cluster':
        return <ClusterChart data={data} config={config} />;
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">نوع الرسم البياني غير مدعوم: {config.type}</p>
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="chart-container">
        {renderChart()}
      </div>
      {onExport && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onExport('png')}
            className="px-2 py-1 text-xs bg-white border rounded shadow hover:bg-gray-50"
          >
            PNG
          </button>
          <button
            onClick={() => onExport('pdf')}
            className="px-2 py-1 text-xs bg-white border rounded shadow hover:bg-gray-50"
          >
            PDF
          </button>
        </div>
      )}
    </div>
  );
};
