import { Bell, User } from "lucide-react";
export const TopNavigation = () => {
  return <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Right side - Logo and brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Morvo منصة</h1>
          <p className="text-xs text-gray-500">فريق التسويق الذكي المتكامل</p>
        </div>
      </div>

      {/* Center - Navigation tabs */}
      <nav className="flex items-center gap-8">
        <a href="#" className="text-gray-900 font-medium border-b-2 border-blue-600 pb-2">Morvo</a>
        <a href="#" className="text-gray-500 hover:text-gray-900">سوشال</a>
        <a href="#" className="text-gray-500 hover:text-gray-900"> الحملات</a>
        <a href="#" className="text-gray-500 hover:text-gray-900">المحتوى</a>
        <a href="#" className="text-gray-500 hover:text-gray-900">التحليلات</a>
      </nav>

      {/* Left side - Notifications and profile */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </header>;
};