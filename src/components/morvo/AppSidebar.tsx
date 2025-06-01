
import { useState } from "react";
import { AIManager } from "@/types/morvo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  BarChart3, 
  Megaphone, 
  PenTool, 
  TrendingUp, 
  Eye,
  Activity,
  Database
} from "lucide-react";
import { ChatSection } from "./ChatSection";

interface AppSidebarProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

const MANAGER_CONFIG = {
  strategic: {
    icon: TrendingUp,
    label: "المدير الاستراتيجي",
    color: "bg-blue-500",
    description: "التخطيط والاستراتيجية"
  },
  monitor: {
    icon: Eye,
    label: "مراقبة وسائل التواصل",
    color: "bg-purple-500",
    description: "مراقبة المنصات الاجتماعية"
  },
  executor: {
    icon: Megaphone,
    label: "مدير الحملات",
    color: "bg-green-500",
    description: "تنفيذ الحملات الإعلانية"
  },
  creative: {
    icon: PenTool,
    label: "مبدعة المحتوى",
    color: "bg-pink-500",
    description: "إنتاج المحتوى الإبداعي"
  },
  analyst: {
    icon: BarChart3,
    label: "محلل البيانات",
    color: "bg-orange-500",
    description: "تحليل الأرقام والأداء"
  },
  performance: {
    icon: Activity,
    label: "الأداء والأمان",
    color: "bg-red-500",
    description: "مراقبة النظام والذاكرة"
  }
} as const;

export const AppSidebar = ({ selectedManager, onManagerSelect }: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar className="border-r bg-card" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg">Morvo</h2>
              <p className="text-xs text-muted-foreground">فريق التسويق الذكي</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <div className="space-y-2">
          {Object.entries(MANAGER_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isSelected = selectedManager === key;
            
            return (
              <Button
                key={key}
                variant={isSelected ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isSelected ? config.color + " text-white" : ""
                }`}
                onClick={() => onManagerSelect(key as AIManager)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <div className="ml-3 rtl:mr-3 rtl:ml-0 text-right rtl:text-right flex-1 min-w-0">
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-xs opacity-80 truncate">{config.description}</div>
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-medium">المحادثة</span>
            {selectedManager && (
              <Badge variant="secondary" className="text-xs">
                {MANAGER_CONFIG[selectedManager].label}
              </Badge>
            )}
          </div>
          
          <Card className="p-3">
            <ChatSection selectedManager={selectedManager} />
          </Card>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
