
import React from 'react';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Zap } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardTopHeaderProps {
  activeSection: string;
  navigationItems: NavigationItem[];
  user: any;
}

export const DashboardTopHeader = ({ activeSection, navigationItems, user }: DashboardTopHeaderProps) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {navigationItems.find(item => item.id === activeSection)?.label || 'لوحة التحكم'}
          </h1>
          <p className="text-sm text-gray-600">
            مرحباً، {user?.email?.split('@')[0]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          تحسين ذكي
        </Button>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
