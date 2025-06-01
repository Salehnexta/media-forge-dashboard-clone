
import React from 'react';
import { TrendChart } from './TrendChart';
import { ChartConfig } from '@/types/visualization';

interface ForecastChartProps {
  data: any[];
  config: ChartConfig;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, config }) => {
  const forecastConfig = {
    ...config,
    options: {
      ...config.options,
      forecast: true
    }
  };
  
  return <TrendChart data={data} config={forecastConfig} />;
};
