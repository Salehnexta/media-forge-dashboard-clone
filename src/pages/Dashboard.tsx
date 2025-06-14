
import React from 'react';
import { EnhancedDashboardLayout } from '@/components/dashboard/EnhancedDashboardLayout';
import { Navigation } from '@/components/layout/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="pt-16">
        <EnhancedDashboardLayout />
      </div>
    </div>
  );
};

export default Dashboard;
