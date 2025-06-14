
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ThemeLanguageToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            {language === 'ar' ? 'العربية' : 'English'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DropdownMenuItem 
            onClick={() => setLanguage('ar')}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            🇸🇦 العربية
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setLanguage('en')}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            🇺🇸 English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="gap-2"
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-4 h-4" />
            {language === 'ar' ? 'داكن' : 'Dark'}
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            {language === 'ar' ? 'فاتح' : 'Light'}
          </>
        )}
      </Button>
    </div>
  );
};
