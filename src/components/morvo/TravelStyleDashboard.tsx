
import React, { useState } from 'react';
import { MessageCircle, Hotel, Plane, MapPin, Send, Plus, Settings, User, Calendar, Search, Star, Clock, Navigation, Filter, Map, List, Brain } from 'lucide-react';

import { ConversationalDashboard } from './ConversationalDashboard';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
}

export const TravelStyleDashboard = () => {
  const [currentView, setCurrentView] = useState<'conversational' | 'traditional'>('traditional');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "مرحباً! أنا هنا لمساعدتك في التسويق الذكي. اسألني أي شيء عن الحملات، المحتوى، أو التحليلات.", sender: 'assistant' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "شكراً لسؤالك! أقوم بتحليل بياناتك الآن...",
        sender: 'assistant'
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderHeader = () => (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">مورفو AI</h1>
              <p className="text-xs text-gray-500">منصة التسويق الذكي</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('conversational')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  currentView === 'conversational'
                    ? 'bg-white text-blue-600 shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🤖 التفاعلي
              </button>
              <button
                onClick={() => setCurrentView('traditional')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  currentView === 'traditional'
                    ? 'bg-white text-blue-600 shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 التقليدي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'conversational') {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        <ConversationalDashboard className="h-[calc(100vh-64px)]" />
      </div>
    );
  }

  // Traditional dashboard view with ORIGINAL design
  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <div className="flex h-[calc(100vh-64px)]" dir="rtl">
        {/* Enhanced Chat Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">مورفو AI المحسن</h1>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Plus className="w-5 h-5 text-gray-600"/>
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">الشات المحسن مع الذكاء الاصطناعي</div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className="flex items-start gap-3 max-w-sm">
                  {message.sender === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-teal-500 text-white rounded-bl-sm' 
                      : 'bg-gray-100 text-gray-800 rounded-br-sm'
                  }`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex justify-end">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg rounded-br-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">مورفو يفكر</div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="اسأل عن التسويق الذكي..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                dir="rtl"
                onKeyPress={handleKeyPress}
              />
              <button 
                onClick={handleSendMessage}
                className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Send className="w-4 h-4"/>
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              💡 جرب: "أظهر لي أداء المبيعات" أو "كيف أداء وسائل التواصل؟"
            </div>
          </div>
        </div>
        
        {/* ORIGINAL Main Dashboard Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Hotel className="w-4 h-4"/>
                  الفنادق
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Plane className="w-4 h-4"/>
                  الطيران
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4"/>
                  الأنشطة
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Filter className="w-5 h-5"/>
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Map className="w-5 h-5"/>
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <List className="w-5 h-5"/>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">خطط رحلتك القادمة</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400"/>
                  <input 
                    type="text" 
                    placeholder="من أين؟"
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400"/>
                  <input 
                    type="text" 
                    placeholder="إلى أين؟"
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400"/>
                  <input 
                    type="date" 
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Search className="w-5 h-5"/>
                  البحث
                </button>
              </div>
            </div>

            {/* Featured Destinations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">دبي</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">مدينة الأحلام والتسوق الفاخر</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">1,200 ر.س</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-green-400 to-teal-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">إسطنبول</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                      <span className="text-sm text-gray-600">4.6</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">التاريخ والثقافة العريقة</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">900 ر.س</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-red-400 to-pink-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">باريس</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current"/>
                      <span className="text-sm text-gray-600">4.9</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">مدينة الأنوار والرومانسية</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">1,800 ر.س</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Hotel className="w-6 h-6 text-blue-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">2,450+</h3>
                <p className="text-gray-600 text-sm">فندق متاح</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plane className="w-6 h-6 text-green-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">180+</h3>
                <p className="text-gray-600 text-sm">وجهة سفر</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-purple-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">50,000+</h3>
                <p className="text-gray-600 text-sm">عميل سعيد</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-yellow-600"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">4.8/5</h3>
                <p className="text-gray-600 text-sm">تقييم العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
