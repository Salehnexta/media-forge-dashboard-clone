
import { SocialCharts } from '../charts/SocialCharts';

export const SocialDashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-pink-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">لوحة تحكم السوشال ميديا</h1>
          <p className="text-gray-600">مراقبة وتحليل أداء منصات التواصل الاجتماعي</p>
        </div>
        <SocialCharts />
      </div>
    </div>
  );
};
