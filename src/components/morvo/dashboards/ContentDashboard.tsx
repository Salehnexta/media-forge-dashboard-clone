import { ContentCharts } from '../charts/ContentCharts';
import { RailwayAgentPanel } from '../../railway/RailwayAgentPanel';
export const ContentDashboard = () => {
  return <div className="p-8 bg-gradient-to-br from-purple-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">لوحة تحكم المحتوى</h1>
          <p className="text-gray-600">إنشاء وإدارة المحتوى الإبداعي مع Railway AI</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ContentCharts />
          </div>
          
        </div>
      </div>
    </div>;
};