
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
  Bot,
  Target,
  MessageSquare,
  BarChart3,
  Brain,
  Users
} from "lucide-react";
import { AIManager } from "@/types/morvo";

interface AppSidebarProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

export function AppSidebar({ selectedManager, onManagerSelect }: AppSidebarProps) {
  const marketingTeam = [
    { 
      id: 'strategic', 
      name: 'أحمد - الاستراتيجي', 
      description: 'مدير التسويق الاستراتيجي', 
      icon: Target 
    },
    { 
      id: 'monitor', 
      name: 'فاطمة - السوشال', 
      description: 'مديرة وسائل التواصل الاجتماعي', 
      icon: MessageSquare 
    },
    { 
      id: 'executor', 
      name: 'محمد - الحملات', 
      description: 'مدير الحملات والأداء', 
      icon: BarChart3 
    },
    { 
      id: 'creative', 
      name: 'نورا - المحتوى', 
      description: 'مديرة المحتوى والإبداع', 
      icon: Brain 
    },
    { 
      id: 'analyst', 
      name: 'خالد - التحليلات', 
      description: 'مدير التحليلات ومراقبة العلامة التجارية', 
      icon: Users 
    },
  ];

  return (
    <Sidebar side="right" className="border-l-0 border-r">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">منصة Morvo</h1>
            <p className="text-xs text-gray-500">فريق التسويق الذكي المتكامل</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                مرحباً بك في فريق التسويق الذكي المتكامل
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                يمكنك التحدث مع أي من المديرين الخمسة المتخصصين:
              </p>
            </div>
            
            <SidebarMenu className="space-y-2 px-4">
              {marketingTeam.map((member) => (
                <SidebarMenuItem key={member.id}>
                  <SidebarMenuButton
                    onClick={() => onManagerSelect(member.id as AIManager)}
                    className={`w-full justify-start px-4 py-4 text-right rounded-lg border transition-all duration-200 ${
                      selectedManager === member.id
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <member.icon
                          className={`h-5 w-5 ${
                            selectedManager === member.id ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                        <div className="font-medium text-sm">{member.name}</div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">{member.description}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <span className="text-sm font-semibold">م.أ</span>
              </div>
            </div>
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-700">محمد أحمد</p>
              <p className="text-xs font-medium text-gray-500">الخطة المميزة</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-800">
            مرحباً! اختر مديراً من الأعلى للبدء في المحادثة
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarTrigger className="absolute top-4 left-4" />
    </Sidebar>
  );
}
