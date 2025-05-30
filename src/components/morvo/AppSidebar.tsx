import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Home, 
  BarChart3,
  Settings,
  Video,
  Mic,
  Image,
  FileText,
  TestTube,
  Presentation
} from "lucide-react";
import { AIManager } from "@/types/morvo";

interface AppSidebarProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

export function AppSidebar({ selectedManager, onManagerSelect }: AppSidebarProps) {
  const navigation = [
    { name: 'لوحة التحكم', href: '#', icon: Home, manager: 'strategic' as AIManager },
    { name: 'مولد الصوت', href: '#', icon: Mic, manager: 'creative' as AIManager },
    { name: 'مولد الصور', href: '#', icon: Image, manager: 'creative' as AIManager },
    { name: 'مولد الفيديو', href: '#', icon: Video, manager: 'creative' as AIManager },
    { name: 'مولد المستندات', href: '#', icon: FileText, manager: 'executor' as AIManager },
    { name: 'التحليلات', href: '#', icon: BarChart3, manager: 'analyst' as AIManager },
    { name: 'مختبر الذكاء الاصطناعي', href: '#', icon: TestTube, manager: 'monitor' as AIManager },
    { name: 'العروض التقديمية', href: '#', icon: Presentation, manager: 'executor' as AIManager },
    { name: 'الإعدادات', href: '#', icon: Settings, manager: 'strategic' as AIManager },
  ];

  return (
    <Sidebar side="right" className="border-l-0 border-r">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Media Genius AI</h1>
            <p className="text-xs text-gray-500">الذكاء الاصطناعي للوسائط</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-4">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => onManagerSelect(item.manager)}
                    className={`w-full justify-start px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      selectedManager === item.manager
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`ml-3 h-5 w-5 ${
                        selectedManager === item.manager ? 'text-blue-600' : 'text-gray-400'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="text-lg font-semibold">م.أ</span>
            </div>
          </div>
          <div className="mr-3">
            <p className="text-sm font-medium text-gray-700">محمد أحمد</p>
            <p className="text-xs font-medium text-gray-500">الخطة المميزة</p>
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarTrigger className="absolute top-4 left-4" />
    </Sidebar>
  );
}
