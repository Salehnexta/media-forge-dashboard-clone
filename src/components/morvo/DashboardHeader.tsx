
import { AIManager } from "@/types/morvo";

interface DashboardHeaderProps {
  selectedManager: AIManager;
}

export const DashboardHeader = ({ selectedManager }: DashboardHeaderProps) => {
  const managerTitles = {
    strategic: "الاستراتيجي - يخطط الرؤية ويحدد أولويات الميزانيات",
    creative: "المبدع - يبتكر المحتوى والوسائط الإبداعية",
    executor: "المنفذ - ينجز المهام ويدير العمليات",
    analyst: "المحلل - يحلل البيانات ويقدم الإحصائيات",
    monitor: "المراقب - يتابع الأداء ويحسن النتائج"
  };

  const managerDescriptions = {
    strategic: "قائد حكيم وخبير استراتيجي يفكر بعقلية الرئيس التنفيذي",
    creative: "فنان مبدع ومبتكر يحول الأفكار إلى محتوى بصري وصوتي مميز",
    executor: "منسق ماهر ومنظم يحول الخطط إلى واقع ملموس",
    analyst: "خبير بيانات ومحلل ذكي يكشف الأنماط والاتجاهات",
    monitor: "مراقب دقيق ومحسن مستمر للأداء والجودة"
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">
        {managerTitles[selectedManager]}
      </h1>
      <p className="text-gray-600 text-lg">
        {managerDescriptions[selectedManager]}
      </p>
    </div>
  );
};
