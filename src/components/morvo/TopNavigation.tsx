
import { Bell, User } from "lucide-react";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const tabs = [
    { id: 'morvo', label: 'Morvo', icon: '🏠' },
    { id: 'social', label: 'سوشال', icon: '📱' },
    { id: 'campaigns', label: 'الحملات', icon: '🎯' },
    { id: 'content', label: 'المحتوى', icon: '✨' },
    { id: 'analytics', label: 'التحليلات', icon: '📊' }
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Right side - Logo and brand */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden">
          <img 
            src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" 
            alt="Morvo Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            منصة Morvo
          </h1>
          <p className="text-xs text-gray-500 font-medium">فريق التسويق الذكي المتكامل</p>
        </div>
      </div>

      {/* Center - Navigation tabs */}
      <nav className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Left side - Notifications and profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative group">
          <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
              3
            </span>
          </button>
          
          {/* Simple tooltip on hover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            لديك 3 إشعارات جديدة
          </div>
        </div>

        {/* Profile */}
        <div className="relative group">
          <button className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
            <User className="w-5 h-5 text-white" />
          </button>
          
          {/* Simple tooltip on hover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            الملف الشخصي
          </div>
        </div>
      </div>
    </header>
  );
};
