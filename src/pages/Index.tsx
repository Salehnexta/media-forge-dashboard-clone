
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <DashboardHeader />
        <div className="space-y-8">
          <MetricsGrid />
          <ChartsSection />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Index;
