
import React from 'react';
import { MessageCircle, Sparkles, Bot } from 'lucide-react';
import { CompactChat } from '@/components/chat/CompactChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Chat Area - 40% - على اليسار في RTL */}
      <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
        <CompactChat />
      </div>

      {/* Dashboard Content Area - 60% - على اليمين في RTL */}
      <div className="flex-1 w-3/5 overflow-auto bg-white">
        {children}
      </div>
    </div>
  );
};
