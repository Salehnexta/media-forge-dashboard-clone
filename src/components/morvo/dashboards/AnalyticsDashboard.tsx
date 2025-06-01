
import { AnalyticsCharts } from '../charts/AnalyticsCharts';
import { RailwayAgentPanel } from '../../railway/RailwayAgentPanel';

export const AnalyticsDashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">لوحة تحكم التحليلات</h1>
          <p className="text-gray-600">تحليل شامل للبيانات والمؤشرات مع دعم Railway AI</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalyticsCharts />
          </div>
          <div>
            <RailwayAgentPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
