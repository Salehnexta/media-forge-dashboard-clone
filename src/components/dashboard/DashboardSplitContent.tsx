
import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { EnhancedLovableChat } from '@/components/chat/EnhancedLovableChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Dashboard Content Area - 60% */}
      <div className="flex-1 w-3/5 overflow-auto">
        <div className="h-full p-6">
          {children}
        </div>
      </div>

      {/* Chat Area - 40% */}
      <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col shadow-lg">
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">مورفو AI</h3>
                <p className="text-blue-100 text-sm">مساعدك الذكي للتسويق الرقمي</p>
              </div>
              <div className="mr-auto">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Chat Content */}
          <div className="flex-1 min-h-0 bg-gray-50">
            <EnhancedLovableChat />
          </div>
        </div>
      </div>
    </div>
  );
};
