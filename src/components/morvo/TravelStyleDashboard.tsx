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
  const [mapView, setMapView] = useState(false);

  // Analyze message to determine what dashboard to show
  const analyzeMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('حملة') || lowerMessage.includes('إعلان') || lowerMessage.includes('campaign') || lowerMessage.includes('ad')) {
      return 'campaigns';
    } else if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشور') || lowerMessage.includes('content') || lowerMessage.includes('post')) {
      return 'content';
    } else if (lowerMessage.includes('تحليل') || lowerMessage.includes('إحصائيات') || lowerMessage.includes('analytics') || lowerMessage.includes('metrics')) {
      return 'analytics';
    } else if (lowerMessage.includes('سوشال') || lowerMessage.includes('تواصل') || lowerMessage.includes('social') || lowerMessage.includes('media')) {
      return 'social';
    }
    return currentView;
  };

  // Generate contextual response based on user message
  const generateResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('حملة') || lowerMessage.includes('campaign')) {
      return "ممتاز! سأعرض لك أفضل الحملات التسويقية المتاحة مع تحليل الأداء والنتائج المتوقعة.";
    } else if (lowerMessage.includes('محتوى') || lowerMessage.includes('content')) {
      return "رائع! دعني أساعدك في إدارة المحتوى وجدولة المنشورات عبر منصات التواصل المختلفة.";
    } else if (lowerMessage.includes('تحليل') || lowerMessage.includes('analytics')) {
      return "بالطبع! سأعرض لك التحليلات التفصيلية وإحصائيات الأداء لحملاتك التسويقية.";
    } else if (lowerMessage.includes('سوشال') || lowerMessage.includes('social')) {
      return "عظيم! سأعرض لك إدارة وسائل التواصل الاجتماعي مع مراقبة التفاعل والأداء.";
    }
    return "فهمت! دعني أساعدك في ذلك. إليك ما وجدته:";
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage: Message = { 
        id: messages.length + 1, 
        text: inputMessage, 
        sender: 'user' 
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      
      // Analyze message and change dashboard
      const newView = analyzeMessage(inputMessage);
      setCurrentView(newView);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Generate assistant response after a delay
      setTimeout(() => {
        const assistantResponse: Message = {
          id: messages.length + 2,
          text: generateResponse(inputMessage),
          sender: 'assistant'
        };
        setMessages(prev => [...prev, assistantResponse]);
        setIsTyping(false);
      }, 1500);
      
      setInputMessage('');
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

            <div className="flex gap-2">
              <button 
                onClick={() => setInputMessage("أنشئ حملة تسويقية")}
                className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
              >
                + إنشاء حملة
              </button>
              <button 
                onClick={() => setInputMessage("أعرض المحتوى")}
                className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
              >
                + إدارة المحتوى
              </button>
              <button 
                onClick={() => setInputMessage("اعرض التحليلات")}
                className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
              >
                + عرض التحليلات
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

  const renderDashboardContent = () => {
    switch(currentView) {
      case 'welcome':
        return (
          <div className="relative h-full">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop')"
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white max-w-2xl px-6">
                <h1 className="text-5xl font-bold mb-6">مرحباً بك في مورفو AI</h1>
                <h2 className="text-2xl mb-8 opacity-90">ابدأ من هنا واسألني أي شيء عن التسويق الذكي</h2>
                
                {/* Quick Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-12">
                  <button 
                    onClick={() => setInputMessage("أنشئ حملة تسويقية")}
                    className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
                  >
                    + إنشاء حملة
                  </button>
                  <button 
                    onClick={() => setInputMessage("أعرض المحتوى")}
                    className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
                  >
                    + إدارة المحتوى
                  </button>
                  <button 
                    onClick={() => setInputMessage("اعرض التحليلات")}
                    className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
                  >
                    + عرض التحليلات
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'campaigns':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">محرك الحملات الذكي</h1>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setMapView(!mapView)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      mapView ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mapView ? <List className="w-4 h-4"/> : <Map className="w-4 h-4"/>}
                    {mapView ? 'قائمة' : 'خريطة'}
                  </button>
                  <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                    بحث
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text" 
                  value="حملات تسويقية للمنتجات التقنية مع استهداف الشباب السعودي"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  dir="rtl"
                />
              </div>
              
              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">للشباب 18-35</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">ميزانية 50,000 ريال</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">منصات متعددة</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">مدة شهر واحد</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">تركيز على النتائج</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex">
              {/* Campaigns List */}
              <div className={`${mapView ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto`}>
                <div className="space-y-6">
                  {/* Featured Campaign */}
                  <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop" 
                        alt="Campaign" 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                        95% توافق
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">حملة المنتجات التقنية الذكية</h3>
                        <div className="flex items-center bg-blue-600 text-white px-2 py-1 rounded text-sm">
                          9.1 <span className="ml-1 text-xs">(412 تقييم)</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">استهداف دقيق للشباب السعودي المهتم بالتقنية</p>
                      <p className="text-gray-600 mb-4">منصات متعددة مع تركيز على النتائج</p>
                      
                      <div className="flex gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">فيسبوك</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">إنستغرام</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">تويتر</span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 italic">
                        "حملة شاملة تستهدف الشباب السعودي المهتم بالتقنية مع تصميمات إبداعية ومحتوى جذاب"
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">45,000 ريال</span>
                          <span className="text-gray-600 ml-1">إجمالي الميزانية</span>
                        </div>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          تشغيل الحملة
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Campaigns */}
                  {[
                    { name: "حملة العروض الموسمية", price: "32,000 ريال", rating: "8.9", reviews: "325" },
                    { name: "حملة التوعية بالعلامة التجارية", price: "28,500 ريال", rating: "8.7", reviews: "198" },
                    { name: "حملة المنتجات الجديدة", price: "38,750 ريال", rating: "8.5", reviews: "267" }
                  ].map((campaign, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg border p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center bg-blue-600 text-white px-2 py-1 rounded text-sm mr-3">
                              {campaign.rating} <span className="ml-1 text-xs">({campaign.reviews} تقييم)</span>
                            </div>
                          </div>
                          <p className="text-gray-600">استهداف متقدم ونتائج مضمونة</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{campaign.price}</div>
                          <div className="text-gray-600 text-sm mb-2">إجمالي الميزانية</div>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            تشغيل الحملة
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map View */}
              {mapView && (
                <div className="w-1/2 relative">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop')"
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-100 bg-opacity-50"></div>
                    {/* Map Markers */}
                    <div className="absolute top-1/4 left-1/3 bg-white px-2 py-1 rounded shadow-lg text-sm font-bold">
                      45K ريال
                    </div>
                    <div className="absolute top-1/2 left-1/2 bg-white px-2 py-1 rounded shadow-lg text-sm font-bold">
                      32K ريال
                    </div>
                    <div className="absolute top-3/4 left-1/4 bg-white px-2 py-1 rounded shadow-lg text-sm font-bold">
                      28.5K ريال
                    </div>
                    <div className="absolute top-1/3 right-1/3 bg-white px-2 py-1 rounded shadow-lg text-sm font-bold">
                      38.7K ريال
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'content':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">مقارن المحتوى</h1>
                <div className="text-sm text-gray-600 flex items-center">
                  مدعوم بواسطة <span className="ml-2 text-blue-600 font-semibold">مورفو AI</span>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <input 
                  type="text" 
                  value="محتوى إبداعي للسوشال ميديا لمدة أسبوع مع جدولة تلقائية"
                  className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  dir="rtl"
                />
                <button className="absolute left-2 top-2 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                  بحث
                </button>
              </div>
              
              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">منشورات يومية</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">تصاميم جذابة</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">جدولة ذكية</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">محتوى متنوع</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">أقصى تفاعل</span>
              </div>
            </div>
            
            {/* Content Results */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Best Value Content */}
                <div className="bg-white rounded-xl shadow-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-600"/>
                      <span className="font-medium">محتوى</span>
                      <span className="text-gray-600">الخيار الأول</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    أفضل قيمة مع محتوى إبداعي متنوع، تصاميم جذابة وجدولة ذكية لمدة أسبوع كامل مع توقع تفاعل عالي
                  </p>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                          م
                        </div>
                        <div>
                          <div className="font-semibold">7 منشورات متنوعة</div>
                          <div className="text-sm text-gray-600">محتوى إبداعي + تصاميم</div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-sm text-gray-600">أسبوع كامل</div>
                          <div className="text-sm text-gray-600">جدولة ذكية</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">تفاعل عالي</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">2,500 ريال</div>
                        <div className="text-sm text-gray-600">للأسبوع</div>
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                          عرض التفاصيل ←
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Alternative Content */}
                <div className="bg-white rounded-xl shadow-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-600"/>
                      <span className="font-medium">محتوى</span>
                      <span className="text-gray-600">الخيار الثاني</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    حزمة محتوى شاملة مع استراتيجية متقدمة وتحليلات مفصلة لضمان أفضل النتائج والوصول
                  </p>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                          م
                        </div>
                        <div>
                          <div className="font-semibold">10 منشورات + استراتيجية</div>
                          <div className="text-sm text-gray-600">محتوى متقدم + تحليلات</div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-sm text-gray-600">أسبوع ونصف</div>
                          <div className="text-sm text-gray-600">جدولة احترافية</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">نتائج مضمونة</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">4,200 ريال</div>
                        <div className="text-sm text-gray-600">للحزمة</div>
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                          عرض التفاصيل ←
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">خطة التحليلات المخصصة</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600"/>
                    مؤشرات الأداء لـ 7 أيام
                  </h3>
                  <div className="space-y-4">
                    {[
                      { day: "اليوم الأول", activity: "تحليل الوصول والانطباعات", time: "تحليل شامل" },
                      { day: "اليوم الثاني", activity: "مراقبة التفاعل والمشاركات", time: "9 ص - 6 م" },
                      { day: "اليوم الثالث", activity: "تحليل الجمهور والديموغرافيا", time: "10 ص - 8 م" },
                      { day: "اليوم الرابع", activity: "قياس عائد الاستثمار", time: "مراقبة مستمرة" },
                      { day: "اليوم الخامس", activity: "تقرير الأداء النهائي", time: "نصف اليوم" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.day}</div>
                          <div className="text-gray-700">{item.activity}</div>
                          <div className="text-sm text-blue-600">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-xl font-semibold mb-4">المؤشرات الموصى بها</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'تحليل وصول المنشورات', price: '450 ريال', duration: '3 ساعات', rating: '4.8' },
                      { name: 'مراقبة التفاعل المباشر', price: '320 ريال', duration: '2 ساعة', rating: '4.9' },
                      { name: 'تحليل الجمهور المستهدف', price: '280 ريال', duration: '2.5 ساعة', rating: '4.7' },
                      { name: 'تقرير عائد الاستثمار', price: '650 ريال', duration: '4 ساعات', rating: '4.9' }
                    ].map((metric, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{metric.name}</div>
                          <div className="text-sm text-gray-600">{metric.duration}</div>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 mr-1"/>
                            <span className="text-sm text-gray-600">{metric.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600 text-lg">{metric.price}</div>
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            إضافة للتحليل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">إدارة وسائل التواصل الاجتماعي</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-600"/>
                    المنصات النشطة
                  </h3>
                  <div className="space-y-4">
                    {[
                      { platform: "إنستغرام", followers: "25.4K", engagement: "8.7%", status: "نشط" },
                      { platform: "تويتر", followers: "18.2K", engagement: "6.2%", status: "نشط" },
                      { platform: "فيسبوك", followers: "32.1K", engagement: "5.9%", status: "نشط" },
                      { platform: "لينكد إن", followers: "12.8K", engagement: "4.3%", status: "خامل" },
                      { platform: "تيك توك", followers: "45.6K", engagement: "12.1%", status: "نشط جداً" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {item.platform.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{item.platform}</div>
                            <div className="text-sm text-gray-600">{item.followers} متابع</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">{item.engagement}</div>
                          <div className="text-xs text-gray-600">{item.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <h3 className="text-xl font-semibold mb-4">الأنشطة الموصى بها</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'حملة تفاعل إنستغرام', price: '850 ريال', duration: 'أسبوع', rating: '4.8' },
                      { name: 'استراتيجية محتوى تويتر', price: '650 ريال', duration: '5 أيام', rating: '4.9' },
                      { name: 'تفاعل مجتمع فيسبوك', price: '720 ريال', duration: 'أسبوعين', rating: '4.7' },
                      { name: 'فيديوهات ترندز تيك توك', price: '1200 ريال', duration: '10 أيام', rating: '4.9' }
                    ].map((activity, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{activity.name}</div>
                          <div className="text-sm text-gray-600">{activity.duration}</div>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 mr-1"/>
                            <span className="text-sm text-gray-600">{activity.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600 text-lg">{activity.price}</div>
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            إضافة للخطة
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Chat Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-800">مورفو AI</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Plus className="w-5 h-5 text-gray-600"/>
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">استشارة تسويقية</div>
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
        
        {/* Quick Suggestions */}
        {currentView === 'welcome' && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => setInputMessage("أنشئ حملة تسويقية")}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + إنشاء حملة
              </button>
              <button 
                onClick={() => setInputMessage("أعرض المحتوى")}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + إدارة المحتوى
              </button>
              <button 
                onClick={() => setInputMessage("اعرض التحليلات")}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + عرض التحليلات
              </button>
            </div>
          </div>
        )}
        
        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اسأل أي شيء، كلما شاركت أكثر كلما تمكنت من مساعدتك بشكل أفضل..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              dir="rtl"
            />
            <button 
              onClick={handleSendMessage}
              className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Send className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col">
        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};
