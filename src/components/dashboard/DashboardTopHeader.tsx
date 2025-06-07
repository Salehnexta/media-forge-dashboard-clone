
import React from 'react';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Zap, Settings, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

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
  const currentSection = navigationItems.find(item => item.id === activeSection);
  
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            {currentSection?.icon && <currentSection.icon className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {currentSection?.label || 'لوحة التحكم'}
            </h1>
            <p className="text-sm text-gray-500">
              أهلاً {user?.email?.split('@')[0]}، مرحباً بك في منصة مورفو
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث في لوحة التحكم..."
            className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>

        {/* Action Buttons */}
        <Button variant="outline" size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700">
          <Zap className="w-4 h-4" />
          تحليل ذكي
        </Button>
        
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
        </Button>
        
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
