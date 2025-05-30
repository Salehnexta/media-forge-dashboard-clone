
import { Bell, User, ChevronDown, Search, Settings } from "lucide-react";
import { useState } from "react";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { id: 'morvo', label: 'Morvo', icon: '🏠' },
    { id: 'social', label: 'سوشال', icon: '📱' },
    { id: 'campaigns', label: 'الحملات', icon: '🎯' },
    { id: 'content', label: 'المحتوى', icon: '✨' },
    { id: 'analytics', label: 'التحليلات', icon: '📊' }
  ];

  const notifications = [
    { id: 1, title: 'حملة جديدة تحتاج مراجعة', time: '5 دقائق', type: 'campaign' },
    { id: 2, title: 'تحليل الأداء الأسبوعي جاهز', time: '15 دقيقة', type: 'analytics' },
    { id: 3, title: 'محتوى جديد تم إنشاؤه', time: '30 دقيقة', type: 'content' }
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative z-50">
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
            className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
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

      {/* Left side - Search, Notifications and profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                <h3 className="font-semibold text-gray-900 text-right">الإشعارات</h3>
                <p className="text-xs text-gray-600 text-right">لديك 3 إشعارات جديدة</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer transition-colors duration-150"
                  >
                    <div className="flex items-start gap-3 text-right" dir="rtl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{notification.title}</p>
                        <p className="text-xs text-gray-500">منذ {notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  عرض جميع الإشعارات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center gap-3 text-right" dir="rtl">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">مستخدم منصة Morvo</p>
                    <p className="text-xs text-gray-600">مدير تسويق</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-50 rounded-xl transition-colors duration-150" dir="rtl">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">الإعدادات</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-gray-50 rounded-xl transition-colors duration-150" dir="rtl">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">الملف الشخصي</span>
                </button>
                <hr className="my-2 border-gray-100" />
                <button className="w-full flex items-center gap-3 p-3 text-right hover:bg-red-50 rounded-xl transition-colors duration-150 text-red-600" dir="rtl">
                  <span className="text-sm">تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
};
