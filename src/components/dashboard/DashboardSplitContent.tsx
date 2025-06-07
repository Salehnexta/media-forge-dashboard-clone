
import React from 'react';
import { CompactChat } from '@/components/chat/CompactChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Chat Sidebar - Left */}
      <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex-shrink-0">
        <CompactChat />
      </div>

      {/* Dashboard Content Area - Right */}
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>
    </div>
  );
};
