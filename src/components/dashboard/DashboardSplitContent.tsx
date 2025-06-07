
import React from 'react';
import { CompactChat } from '@/components/chat/CompactChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      {/* Dashboard Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>

      {/* Chat Area */}
      <div className="h-64 bg-white border-t border-gray-200 shadow-lg">
        <CompactChat />
      </div>
    </div>
  );
};
