
import React from 'react';
import { MessageCircle, Sparkles, Brain } from 'lucide-react';
import { CompactChat } from '@/components/chat/CompactChat';

interface DashboardSplitContentProps {
  children: React.ReactNode;
}

export const DashboardSplitContent = ({ children }: DashboardSplitContentProps) => {
  return (
    <div className="flex-1 flex overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50" dir="rtl">
      {/* Chat Area - 40% - على اليسار في RTL */}
      <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-6 bg-gradient-to-l from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-50"></div>
            </div>
            
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-xl mb-1">وكلاء المحتوى AI</h3>
                <p className="text-blue-100 text-sm">مساعدك الذكي لإنشاء المحتوى</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Chat Content */}
          <div className="flex-1 min-h-0 bg-gradient-to-b from-gray-50 to-white">
            <CompactChat />
          </div>
        </div>
      </div>

      {/* Dashboard Content Area - 60% - على اليمين في RTL */}
      <div className="flex-1 w-3/5 overflow-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
