
import { AIManager } from "@/types/morvo";

interface DashboardHeaderProps {
  selectedManager: AIManager;
}

export const DashboardHeader = ({ selectedManager }: DashboardHeaderProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">
        الاستراتيجي - يخطط الرؤية ويحدد أولويات الميزانيات
      </h1>
      <p className="text-gray-600 text-lg">
        قائد حكيم وخبير استراتيجي يفكر بعقلية الرئيس التنفيذي
      </p>
    </div>
  );
};
