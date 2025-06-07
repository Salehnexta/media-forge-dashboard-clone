
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { 
  Home,
  BarChart3,
  Users,
  Megaphone,
  PenTool,
  Link,
  FolderOpen,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Brain,
  Sparkles,
  Zap
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarCollapsed: boolean;
  user: any;
  handleSignOut: () => void;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home },
  { id: 'agents', label: 'الوكلاء الأذكياء', icon: Users },
  { id: 'campaigns', label: 'الحملات', icon: Megaphone },
  { id: 'content', label: 'المحتوى', icon: PenTool },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  { id: 'integrations', label: 'التكاملات', icon: Link },
  { id: 'assets', label: 'المكتبة', icon: FolderOpen }
];

export const DashboardSidebar = ({ 
  activeSection, 
  setActiveSection, 
  isSidebarCollapsed, 
  user, 
  handleSignOut 
}: DashboardSidebarProps) => {
  return (
    <Sidebar className="border-l bg-white shadow-xl">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <h2 className="font-bold text-xl text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مورفو AI
              </h2>
              <p className="text-sm text-gray-600">منصة التسويق الذكي</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-12 gap-3 transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="w-5 h-5" />
                {!isSidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* AI Status Panel */}
        {!isSidebarCollapsed && (
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-900">حالة النظام</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700">الوكلاء متصلون</span>
                </div>
                <span className="text-green-600 font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">حملات نشطة</span>
                </div>
                <span className="text-blue-600 font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">تحليل جاري</span>
                </div>
                <span className="text-purple-600 font-semibold">✓</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isSidebarCollapsed && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">إجراءات سريعة</p>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 hover:bg-blue-50 hover:border-blue-200">
              <Bell className="w-4 h-4" />
              الإشعارات
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 hover:bg-purple-50 hover:border-purple-200">
              <HelpCircle className="w-4 h-4" />
              المساعدة
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 hover:bg-gray-50">
              <Settings className="w-4 h-4" />
              الإعدادات
            </Button>
          </div>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-600">مستخدم محترف</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};
