
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'حملة جديدة',
      message: 'تم إنشاء حملة تسويقية جديدة بنجاح',
      time: 'منذ دقيقة',
      read: false
    },
    {
      id: 2,
      title: 'تحديث النتائج',
      message: 'تم تحديث نتائج الحملة الحالية',
      time: 'منذ 5 دقائق',
      read: true
    }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {notifications.some(n => !n.read) && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-12 bg-white rounded-lg shadow-xl border w-80 z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">الإشعارات</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              عرض جميع الإشعارات
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { NotificationCenter };
