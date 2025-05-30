
import { DashboardHeader } from "./DashboardHeader";
import { MetricsOverview } from "./MetricsOverview";
import { ChartsSection } from "./ChartsSection";
import { AIManager } from "@/types/morvo";

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <DashboardHeader selectedManager={selectedManager} />
      <MetricsOverview />
      <ChartsSection selectedManager={selectedManager} />
    </div>
  );
};
