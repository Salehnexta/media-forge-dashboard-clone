
import React from 'react';
import { UnifiedMorvoChat } from '@/components/morvo/UnifiedMorvoChat';

interface SimplifiedDashboardLayoutProps {
  children: React.ReactNode;
}

export const SimplifiedDashboardLayout = ({ children }: SimplifiedDashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Main Dashboard Content - Left (60%) */}
      <div className="w-[60%] overflow-auto bg-white">
        {children}
      </div>

      {/* Unified Morvo Chat - Right (40%) */}
      <div className="w-[40%] bg-white border-r border-gray-200 shadow-lg flex-shrink-0 p-4">
        <UnifiedMorvoChat />
      </div>
    </div>
  );
};
