
import { AnalyticsCharts } from '../charts/AnalyticsCharts';

export const AnalyticsDashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">لوحة تحكم التحليلات</h1>
          <p className="text-gray-600">تحليل شامل للبيانات والمؤشرات</p>
        </div>
        
        <div className="w-full">
          <AnalyticsCharts />
        </div>
      </div>
    </div>
  );
};
