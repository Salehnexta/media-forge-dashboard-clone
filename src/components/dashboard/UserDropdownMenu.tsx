
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Languages 
} from 'lucide-react';

interface UserDropdownMenuProps {
  user: any;
  onSignOut: () => void;
}

export const UserDropdownMenu = ({ user, onSignOut }: UserDropdownMenuProps) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [language, setLanguage] = React.useState('ar');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you can add dark mode logic
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    // Here you can add language switching logic
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white shadow-lg hover:bg-gray-50">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs bg-blue-500 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{user?.email?.split('@')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-sm bg-blue-500 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="w-4 h-4 ml-2" />
          <span>الملف الشخصي</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={toggleLanguage}>
          <Languages className="w-4 h-4 ml-2" />
          <span>اللغة ({language === 'ar' ? 'العربية' : 'English'})</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer p-0">
          <div className="flex items-center justify-between w-full px-2 py-1.5">
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="w-4 h-4 ml-2" />
              ) : (
                <Sun className="w-4 h-4 ml-2" />
              )}
              <span>الوضع المظلم</span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              className="scale-75"
            />
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 ml-2" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
