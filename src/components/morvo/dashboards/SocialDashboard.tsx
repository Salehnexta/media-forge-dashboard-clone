
import { SocialCharts } from '../charts/SocialCharts';
import { RailwayAgentPanel } from '../../railway/RailwayAgentPanel';

export const SocialDashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-pink-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">لوحة تحكم السوشال ميديا</h1>
          <p className="text-gray-600">مراقبة وتحليل منصات التواصل مع Railway AI</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SocialCharts />
          </div>
          <div>
            <RailwayAgentPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
