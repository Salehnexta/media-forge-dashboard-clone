
import { aiManagers } from "@/data/morvoData";
import { AIManager } from "@/types/morvo";

interface DashboardHeaderProps {
  selectedManager: AIManager;
}

export const DashboardHeader = ({ selectedManager }: DashboardHeaderProps) => {
  const currentManager = aiManagers.find(m => m.id === selectedManager);

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            لوحة تحكم مورفو
          </h1>
          <p className="text-gray-600">
            مرحباً بك في منصة التسويق الذكية - يدير حسابك الآن: {currentManager?.name}
          </p>
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-500">المدير النشط</div>
          <div className="text-xl font-bold" style={{ color: currentManager?.color }}>
            {currentManager?.name}
          </div>
        </div>
      </div>
    </div>
  );
};
