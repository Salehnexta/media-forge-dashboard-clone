
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, MessageCircle } from 'lucide-react';
import { UniversalChatWidget } from '@/components/chat/UniversalChatWidget';

const SimpleChat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">مورفو AI</h1>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <BarChart3 className="w-4 h-4" />
                  لوحة التحكم
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            مرحباً بك في مورفو AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            مساعدك الذكي في التسويق الرقمي. تحدث معي كصديق واحصل على استراتيجيات تسويقية مخصصة لعملك.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">محادثة ذكية</h3>
              <p className="text-gray-600">تحدث مع مورفو بشكل طبيعي واحصل على نصائح مخصصة</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تحليلات متقدمة</h3>
              <p className="text-gray-600">احصل على تحليلات شاملة لأداء حملاتك التسويقية</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ذكاء اصطناعي</h3>
              <p className="text-gray-600">تقنيات متطورة لفهم عملك وتقديم الحلول الأمثل</p>
            </div>
          </div>

          <div className="mt-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3">
                ابدأ الآن - انتقل للوحة التحكم
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <UniversalChatWidget />
    </div>
  );
};

export default SimpleChat;
