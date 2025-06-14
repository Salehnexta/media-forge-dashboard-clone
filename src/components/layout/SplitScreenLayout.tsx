
import React, { useState, useCallback } from 'react';
import { useChatLogic } from '@/hooks/useChatLogic';
import { ChatMessage } from '@/types/morvo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Brain, User, MessageCircle, BarChart3, Megaphone, PenTool, TrendingUp } from 'lucide-react';

interface SplitScreenLayoutProps {
  initialDashboardView?: string;
}

export const SplitScreenLayout = ({ initialDashboardView = 'welcome' }: SplitScreenLayoutProps) => {
  const {
    message,
    setMessage,
    messages,
    isTyping,
    handleSendMessage,
    messagesEndRef
  } = useChatLogic();

  const [currentDashboardView, setCurrentDashboardView] = useState(initialDashboardView);

  // Analyze message to determine dashboard view
  const analyzeChatMessage = useCallback((userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('حملة') || lowerMessage.includes('campaign') || lowerMessage.includes('إعلان')) {
      return 'campaigns';
    } else if (lowerMessage.includes('محتوى') || lowerMessage.includes('content') || lowerMessage.includes('منشور')) {
      return 'content';
    } else if (lowerMessage.includes('تحليل') || lowerMessage.includes('analytics') || lowerMessage.includes('إحصائيات')) {
      return 'analytics';
    } else if (lowerMessage.includes('سوشال') || lowerMessage.includes('social') || lowerMessage.includes('تواصل')) {
      return 'social';
    } else if (lowerMessage.includes('استراتيجية') || lowerMessage.includes('strategy') || lowerMessage.includes('خطة')) {
      return 'strategic';
    }
    return currentDashboardView;
  }, [currentDashboardView]);

  const handleChatSend = useCallback(() => {
    if (!message.trim()) return;
    
    // Analyze message and update dashboard view
    const newView = analyzeChatMessage(message);
    setCurrentDashboardView(newView);
    
    // Send the message
    handleSendMessage();
  }, [message, analyzeChatMessage, handleSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const renderDashboardContent = () => {
    switch (currentDashboardView) {
      case 'campaigns':
        return <CampaignsDashboard />;
      case 'content':
        return <ContentDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'social':
        return <SocialDashboard />;
      case 'strategic':
        return <StrategicDashboard />;
      default:
        return <WelcomeDashboard onViewChange={setCurrentDashboardView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Chat Area - Right Side (40%) */}
      <div className="w-[40%] bg-white border-l border-gray-200 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">مورفو AI</h1>
              <p className="text-sm text-gray-600">مساعدك الذكي في التسويق</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">مرحباً بك!</h3>
              <p className="text-gray-600 text-sm mb-4">
                اسألني عن أي شيء متعلق بالتسويق وسأعرض لك المحتوى المناسب
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("أريد إنشاء حملة إعلانية")}
                  className="text-xs"
                >
                  إنشاء حملة
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage("أعرض تحليلات الأداء")}
                  className="text-xs"
                >
                  عرض التحليلات
                </Button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <div className="flex items-start gap-2">
                    {msg.sender === 'user' ? (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    ) : (
                      <Brain className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                    )}
                    <div className="text-sm">{msg.text}</div>
                  </div>
                  <div className="text-xs mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-end">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">مورفو يكتب...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1"
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <Button
              onClick={handleChatSend}
              disabled={!message.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            اكتب عن الحملات، المحتوى، التحليلات أو الاستراتيجية لعرض اللوحة المناسبة
          </div>
        </div>
      </div>

      {/* Dashboard Area - Left Side (60%) */}
      <div className="w-[60%] overflow-auto">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

// Dashboard Components
const WelcomeDashboard = ({ onViewChange }: { onViewChange: (view: string) => void }) => (
  <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center max-w-2xl px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">لوحة تحكم مورفو AI</h1>
      <p className="text-xl text-gray-600 mb-8">ابدأ المحادثة لعرض المحتوى المناسب</p>
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: TrendingUp, title: "الاستراتيجية", view: "strategic", color: "blue" },
          { icon: Megaphone, title: "الحملات", view: "campaigns", color: "green" },
          { icon: PenTool, title: "المحتوى", view: "content", color: "purple" },
          { icon: BarChart3, title: "التحليلات", view: "analytics", color: "orange" }
        ].map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-${item.color}-300`}
          >
            <item.icon className={`w-8 h-8 text-${item.color}-600 mx-auto mb-3`} />
            <div className="font-semibold text-gray-800">{item.title}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CampaignsDashboard = () => (
  <div className="p-8 h-full overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">لوحة الحملات الإعلانية</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">الحملات النشطة</h3>
          <div className="space-y-4">
            {['حملة المنتجات الجديدة', 'حملة العروض الموسمية', 'حملة التوعية بالعلامة التجارية'].map((campaign, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{campaign}</span>
                  <span className="text-green-600 font-bold">نشطة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">الأداء الحالي</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>عدد المشاهدات:</span>
              <span className="font-bold">125,430</span>
            </div>
            <div className="flex justify-between">
              <span>عدد النقرات:</span>
              <span className="font-bold">8,965</span>
            </div>
            <div className="flex justify-between">
              <span>معدل التحويل:</span>
              <span className="font-bold">7.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContentDashboard = () => (
  <div className="p-8 h-full overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">إدارة المحتوى</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">المحتوى المجدول</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
          <div className="text-gray-600">منشور للأسبوع القادم</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">المحتوى المنشور</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">156</div>
          <div className="text-gray-600">منشور هذا الشهر</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">معدل التفاعل</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">8.9%</div>
          <div className="text-gray-600">زيادة 12% عن الشهر الماضي</div>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsDashboard = () => (
  <div className="p-8 h-full overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">التحليلات والإحصائيات</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">نمو الجمهور</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>إنستغرام:</span>
              <span className="font-bold text-pink-600">+2,340</span>
            </div>
            <div className="flex justify-between">
              <span>فيسبوك:</span>
              <span className="font-bold text-blue-600">+1,890</span>
            </div>
            <div className="flex justify-between">
              <span>تويتر:</span>
              <span className="font-bold text-cyan-600">+876</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">عائد الاستثمار</h3>
          <div className="text-4xl font-bold text-green-600 mb-2">324%</div>
          <div className="text-gray-600">زيادة 45% عن الربع الماضي</div>
        </div>
      </div>
    </div>
  </div>
);

const SocialDashboard = () => (
  <div className="p-8 h-full overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">وسائل التواصل الاجتماعي</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">المنصات النشطة</h3>
          <div className="space-y-3">
            {['إنستغرام', 'فيسبوك', 'تويتر', 'لينكد إن'].map((platform, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{platform}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">التفاعل اليومي</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">12.5K</div>
          <div className="text-gray-600">إعجاب، تعليق، مشاركة</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">الوصول الشهري</h3>
          <div className="text-3xl font-bold text-purple-600 mb-2">2.8M</div>
          <div className="text-gray-600">شخص شاهد المحتوى</div>
        </div>
      </div>
    </div>
  </div>
);

const StrategicDashboard = () => (
  <div className="p-8 h-full overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">اللوحة الاستراتيجية</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">الأهداف الحالية</h3>
          <div className="space-y-4">
            {[
              { goal: "زيادة الوعي بالعلامة التجارية", progress: 75 },
              { goal: "تحسين معدل التحويل", progress: 60 },
              { goal: "توسيع القاعدة الجماهيرية", progress: 85 }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{item.goal}</span>
                  <span className="text-sm text-gray-600">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">تحليل SWOT</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800 mb-2">نقاط القوة</div>
              <div className="text-green-600">علامة تجارية قوية</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="font-medium text-red-800 mb-2">نقاط الضعف</div>
              <div className="text-red-600">محدودية الموارد</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-800 mb-2">الفرص</div>
              <div className="text-blue-600">أسواق جديدة</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="font-medium text-yellow-800 mb-2">التهديدات</div>
              <div className="text-yellow-600">المنافسة الشديدة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
