
import React from 'react';
import { CompactChat } from '@/components/chat/CompactChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      {/* Dashboard Content Area - القسم العلوي */}
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>

      {/* Chat Area - القسم السفلي */}
      <div className="h-80 bg-white border-t border-gray-200">
        <CompactChat />
      </div>
    </div>
  );
};
