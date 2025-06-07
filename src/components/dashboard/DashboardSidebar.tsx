
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
  Sparkles
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
  { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
  { id: 'agents', label: 'إدارة الوكلاء', icon: Users },
  { id: 'campaigns', label: 'منشئ الحملات', icon: Megaphone },
  { id: 'content', label: 'المحتوى الإبداعي', icon: PenTool },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  { id: 'integrations', label: 'التكاملات', icon: Link },
  { id: 'assets', label: 'مكتبة الأصول', icon: FolderOpen }
];

export const DashboardSidebar = ({ 
  activeSection, 
  setActiveSection, 
  isSidebarCollapsed, 
  user, 
  handleSignOut 
}: DashboardSidebarProps) => {
  return (
    <Sidebar className="border-l bg-white shadow-lg">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div>
              <h2 className="font-bold text-xl text-gray-900">Morvo AI</h2>
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
                className={`w-full justify-start h-12 gap-3 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                    : "text-gray-700 hover:bg-gray-100"
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

        {/* AI Status */}
        {!isSidebarCollapsed && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">حالة الذكاء الاصطناعي</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">5 وكلاء نشطين</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">المحادثة متاحة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">التحليل الذكي جاري</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isSidebarCollapsed && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات سريعة</p>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <Bell className="w-4 h-4" />
              الإشعارات
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <HelpCircle className="w-4 h-4" />
              المساعدة
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </Button>
          </div>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-600">مستخدم نشط</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};
