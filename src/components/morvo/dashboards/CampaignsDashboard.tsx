
import { CampaignCharts } from '../charts/CampaignCharts';

export const CampaignsDashboard = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">لوحة تحكم الحملات</h1>
          <p className="text-gray-600">إدارة ومتابعة أداء الحملات الإعلانية</p>
        </div>
        <CampaignCharts />
      </div>
    </div>
  );
};
