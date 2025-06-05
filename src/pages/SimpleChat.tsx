
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, TrendingUp, TrendingDown } from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface Stats {
  visitors: number;
  sales: number;
  conversions: number;
  roi: number;
}

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  positive: boolean;
}> = ({ title, value, change, positive }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
      <div className={`flex items-center text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
        {positive ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
        {change}
      </div>
    </div>
  );
};

const ChartCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 font-medium">رسم بياني تفاعلي</p>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed: React.FC = () => {
  const activities = [
    "تم إطلاق حملة جديدة على فيسبوك",
    "تحديث محتوى الموقع الإلكتروني",
    "تحليل منافس جديد مكتمل",
    "رسالة جديدة من العميل",
    "تقرير شهري جاهز للمراجعة"
  ];

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">الأنشطة الأخيرة</h3>
      <div className="space-y-3">
        {activities.slice(0, 3).map((activity, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">{activity}</span>
            <span className="text-gray-500 text-sm">منذ {(index + 1) * 5} دقائق</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'ai', 
      text: 'مرحباً! أنا مورفو، مساعدك الذكي في التسويق. كيف يمكنني مساعدتك اليوم؟', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<Stats>({
    visitors: 2847,
    sales: 47250,
    conversions: 3.2,
    roi: 285
  });

  const responses = [
    'رائع! دعني أحلل هذا لك بالتفصيل',
    'يمكنني مساعدتك في تحسين هذه الحملة',
    'الأرقام تبدو جيدة، هل تريد تقريراً مفصلاً؟',
    'دعني أنشئ لك محتوى جديد ومبتكر',
    'هذا اقتراح ممتاز، سأعمل عليه فوراً',
    'بناءً على التحليل، أنصح بالتركيز على هذا المجال',
    'البيانات تشير إلى نجاح هذه الاستراتيجية',
    'يمكنني تحسين الأداء بنسبة 25% إضافية'
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    
    // إضافة رسالة المستخدم
    const userMessage: Message = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // بدء كتابة مورفو
    setIsTyping(true);
    setInput('');
    
    // رد تلقائي من مورفو
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiMessage: Message = {
        type: 'ai',
        text: randomResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // تحديث الإحصائيات كل 10 ثوان
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        visitors: prev.visitors + Math.floor(Math.random() * 20),
        sales: prev.sales + Math.floor(Math.random() * 500),
        conversions: +(prev.conversions + (Math.random() - 0.5) * 0.1).toFixed(1),
        roi: prev.roi + Math.floor(Math.random() * 5)
      }));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // التمرير إلى آخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* منطقة المحادثة - 40% */}
      <div className="w-2/5 bg-white border-l flex flex-col shadow-lg">
        {/* رأس المحادثة */}
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">🤖 مورفو AI</h1>
            <p className="text-sm opacity-90">مساعدك الذكي في التسويق</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">متصل الآن</span>
            </div>
          </div>
        </header>

        {/* الرسائل */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm xl:max-w-md p-3 rounded-lg shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border'
              }`}>
                <div className="flex items-start gap-2">
                  {msg.type === 'ai' && (
                    <Bot className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                  )}
                  {msg.type === 'user' && (
                    <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">مورفو يكتب...</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* صندوق الإدخال */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..." 
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            اضغط Enter للإرسال • مورفو جاهز لمساعدتك
          </p>
        </div>
      </div>

      {/* لوحة التحكم - 60% */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {/* الشريط العلوي */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">لوحة التحكم</h2>
          <div className="flex gap-4">
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-blue-500 text-blue-600 font-medium">
              نظرة عامة
            </button>
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm border text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors">
              الحملات
            </button>
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm border text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors">
              التحليلات
            </button>
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm border text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors">
              التقارير
            </button>
          </div>
        </div>

        {/* المقاييس الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="الزوار اليوم" 
            value={stats.visitors.toLocaleString('ar-SA')} 
            change="+12%" 
            positive={true}
          />
          <StatCard 
            title="المبيعات" 
            value={`${stats.sales.toLocaleString('ar-SA')} ريال`} 
            change="+8%" 
            positive={true}
          />
          <StatCard 
            title="التحويلات" 
            value={`${stats.conversions}%`} 
            change="-2%" 
            positive={false}
          />
          <StatCard 
            title="العائد على الاستثمار" 
            value={`${stats.roi}%`} 
            change="+15%" 
            positive={true}
          />
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="أداء الحملات الإعلانية" />
          <ChartCard title="مصادر الزوار" />
        </div>

        {/* الأنشطة الأخيرة */}
        <ActivityFeed />
      </div>
    </div>
  );
}
