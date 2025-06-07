
import React from 'react';
import { MessageCircle, Sparkles, Brain } from 'lucide-react';
import { EnhancedLovableChat } from '@/components/chat/EnhancedLovableChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Dashboard Content Area - 60% */}
      <div className="flex-1 w-3/5 overflow-auto bg-white">
        <div className="h-full">
          {children}
        </div>
      </div>

      {/* Chat Area - 40% */}
      <div className="w-2/5 bg-gradient-to-br from-slate-50 to-blue-50 border-l border-gray-200 flex flex-col shadow-xl">
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-xl mb-1">مورفو AI</h3>
                <p className="text-blue-100 text-sm">مساعدك الذكي للتسويق الرقمي</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Chat Content */}
          <div className="flex-1 min-h-0 bg-gradient-to-br from-slate-50 to-blue-50">
            <EnhancedLovableChat />
          </div>
        </div>
      </div>
    </div>
  );
};
