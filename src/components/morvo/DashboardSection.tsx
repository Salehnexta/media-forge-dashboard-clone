
import { DashboardHeader } from "./DashboardHeader";
import { MetricsOverview } from "./MetricsOverview";
import { ChartsSection } from "./ChartsSection";
import { ContentPerformance } from "./ContentPerformance";
import { AudienceDemographics } from "./AudienceDemographics";
import { SocialPlatforms } from "./SocialPlatforms";
import { AIInsights } from "./AIInsights";
import { AIManager } from "@/types/morvo";

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader selectedManager={selectedManager} />
      <MetricsOverview />
      <ChartsSection selectedManager={selectedManager} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentPerformance />
        <AudienceDemographics />
      </div>
      <SocialPlatforms />
      <AIInsights selectedManager={selectedManager} />
    </div>
  );
};
