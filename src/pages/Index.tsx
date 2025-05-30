
import { useState } from "react";
import { ChatSection } from "@/components/morvo/ChatSection";
import { DashboardSection } from "@/components/morvo/DashboardSection";
import { AIManager } from "@/types/morvo";

const Index = () => {
  const [selectedManager, setSelectedManager] = useState<AIManager>("strategic");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <div className="flex h-screen">
        {/* Chat Section - 30% */}
        <div className="w-[30%] border-l border-white/20">
          <ChatSection 
            selectedManager={selectedManager}
            onManagerSelect={setSelectedManager}
          />
        </div>
        
        {/* Dashboard Section - 70% */}
        <div className="w-[70%] overflow-auto">
          <DashboardSection selectedManager={selectedManager} />
        </div>
      </div>
    </div>
  );
};

export default Index;
