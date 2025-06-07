
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { EnhancedLovableChat } from '@/components/chat/EnhancedLovableChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Dashboard Content Area - 60% */}
      <div className="flex-1 w-3/5 p-6 overflow-auto bg-gray-50">
        <div className="h-full">
          {children}
        </div>
      </div>

      {/* Chat Area - 40% */}
      <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col h-full">
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">المحادثة الذكية</h3>
                <p className="text-sm text-gray-600">تحدث مع مساعد Morvo AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <EnhancedLovableChat />
          </div>
        </div>
      </div>
    </div>
  );
};
