
import { useState } from "react";
import { ChatSection } from "@/components/morvo/ChatSection";
import { DashboardSection } from "@/components/morvo/DashboardSection";
import { TopNavigation } from "@/components/morvo/TopNavigation";
import { AIManager } from "@/types/morvo";

const Index = () => {
  const [selectedManager, setSelectedManager] = useState<AIManager>("strategic");

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Chat Section - Left sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <ChatSection 
            selectedManager={selectedManager}
            onManagerSelect={setSelectedManager}
          />
        </div>
        
        {/* Dashboard Section - Main content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <DashboardSection selectedManager={selectedManager} />
        </div>
      </div>
    </div>
  );
};

export default Index;
