
import React from 'react';
import { CompactChat } from '@/components/chat/CompactChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Dashboard Content Area - Left (60%) */}
      <div className="w-[60%] overflow-auto bg-white">
        {children}
      </div>

      {/* Chat Sidebar - Right (40%) */}
      <div className="w-[40%] bg-white border-r border-gray-200 shadow-lg flex-shrink-0">
        <CompactChat />
      </div>
    </div>
  );
};
