
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/morvo/AppSidebar";
import { DashboardSection } from "@/components/morvo/DashboardSection";
import { TopNavigation } from "@/components/morvo/TopNavigation";
import { AIManager } from "@/types/morvo";

const Index = () => {
  const [selectedManager, setSelectedManager] = useState<AIManager>("strategic");

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full" dir="rtl">
        <AppSidebar 
          selectedManager={selectedManager}
          onManagerSelect={setSelectedManager}
        />
        <div className="flex-1 flex flex-col">
          <TopNavigation />
          <main className="flex-1 overflow-auto">
            <DashboardSection selectedManager={selectedManager} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
