
import React from 'react';
import { Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeLanguageToggle } from '@/components/layout/ThemeLanguageToggle';

export const TopNavigation = () => {
  const { t, language } = useLanguage();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${language === 'ar' ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('header.title')}</h1>
        </div>
        
        <div className={`flex items-center ${language === 'ar' ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
          <div className="relative">
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4`} />
            <Input
              type="search"
              placeholder={t('header.search')}
              className={`${language === 'ar' ? 'pr-10' : 'pl-10'} w-64 dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
            />
          </div>
          
          <NotificationCenter />
          
          <ThemeLanguageToggle />
          
          <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-800">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
