
import React, { useState } from 'react';
import { MessageCircle, Hotel, Plane, MapPin, Send, Plus, Settings, User, Calendar, Search, Star, Clock, Navigation, Filter, Map, List, Brain } from 'lucide-react';

import { ConversationalDashboard } from './ConversationalDashboard';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
}

export const TravelStyleDashboard = () => {
  const [currentView, setCurrentView] = useState<'conversational' | 'traditional'>('conversational');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "مرحباً! أنا هنا لمساعدتك في التسويق الذكي. اسألني أي شيء عن الحملات، المحتوى، أو التحليلات.", sender: 'assistant' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  // Traditional dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <div className="flex h-[calc(100vh-64px)]" dir="rtl">
        {/* Chat Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">مورفو AI التقليدي</h1>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Plus className="w-5 h-5 text-gray-600"/>
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-600">النسخة التقليدية من اللوحة</div>
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
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-end">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg rounded-br-sm">
                    <div className="text-sm text-gray-600">مورفو يكتب...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="اسأل أي شيء عن التسويق..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                dir="rtl"
              />
              <button className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Dashboard */}
        <div className="flex-1 flex flex-col">
          {/* Dashboard Content */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">النسخة التقليدية من مورفو AI</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  هذه هي النسخة التقليدية من لوحة التحكم. يمكنك التبديل إلى النسخة التفاعلية للاستفادة من الميزات الجديدة!
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg border max-w-md mx-auto">
                    <h4 className="font-bold text-gray-900 mb-3">✨ جرب النسخة التفاعلية</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      اسأل أسئلة طبيعية واحصل على لوحات تحكم مخصصة فوراً!
                    </p>
                    <button
                      onClick={() => setCurrentView('conversational')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      التبديل للنسخة التفاعلية
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
