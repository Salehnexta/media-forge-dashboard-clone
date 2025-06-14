
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MorvMasterAgentService, MasterAgentMessage, MorvAgent } from '@/services/MorvMasterAgentService';
import { 
  Bot, Send, Users, TrendingUp, BarChart3, Target, 
  MessageSquare, Heart, DollarSign, Clock, Zap, 
  Brain, Star, Shield, Mail, Search, Eye, PenTool, Trophy
} from 'lucide-react';
import { toast } from 'sonner';

export const MorvMainDashboard = () => {
  const [masterService] = useState(() => new MorvMasterAgentService());
  const [messages, setMessages] = useState<MasterAgentMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('master_agent');
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const healthy = await masterService.healthCheck();
    setIsConnected(healthy);
    if (healthy) {
      toast.success('تم الاتصال بنجاح مع مورف AI');
    } else {
      toast.error('فشل في الاتصال بمورف AI');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: MasterAgentMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      conversation_id: '',
      agents_involved: [],
      intent_analysis: { intent: '', language: 'ar', confidence: 0 },
      processing_time_ms: 0,
      cost_tracking: { total_cost: 0, tokens_used: 0 },
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await masterService.sendMessage(inputMessage, selectedAgent);
      if (response) {
        setMessages(prev => [...prev, response]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const getAgentIcon = (agentId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      master_agent: <Brain className="w-5 h-5" />,
      analytics_agent: <BarChart3 className="w-5 h-5" />,
      social_media_agent: <MessageSquare className="w-5 h-5" />,
      seo_agent: <Search className="w-5 h-5" />,
      brand_monitoring_agent: <Shield className="w-5 h-5" />,
      paid_ads_agent: <Target className="w-5 h-5" />,
      email_marketing_agent: <Mail className="w-5 h-5" />,
      content_management_agent: <PenTool className="w-5 h-5" />,
      competitor_analysis_agent: <Trophy className="w-5 h-5" />
    };
    return iconMap[agentId] || <Bot className="w-5 h-5" />;
  };

  const getAgentColor = (agentId: string) => {
    const colorMap: { [key: string]: string } = {
      master_agent: 'from-purple-500 to-purple-600',
      analytics_agent: 'from-blue-500 to-blue-600',
      social_media_agent: 'from-pink-500 to-pink-600',
      seo_agent: 'from-green-500 to-green-600',
      brand_monitoring_agent: 'from-red-500 to-red-600',
      paid_ads_agent: 'from-orange-500 to-orange-600',
      email_marketing_agent: 'from-indigo-500 to-indigo-600',
      content_management_agent: 'from-teal-500 to-teal-600',
      competitor_analysis_agent: 'from-yellow-500 to-yellow-600'
    };
    return colorMap[agentId] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">مورف AI</h1>
                <p className="text-sm text-gray-600">منصة التسويق الذكية متعددة الوكلاء</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={`${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                {isConnected ? 'متصل' : 'غير متصل'}
              </Badge>
              <Button variant="outline" onClick={checkConnection}>
                إعادة الاتصال
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
            <TabsTrigger value="agents">الوكلاء الذكيين</TabsTrigger>
            <TabsTrigger value="chat">المحادثة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">الوكلاء النشطين</p>
                      <p className="text-3xl font-bold">9</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">المحادثات اليوم</p>
                      <p className="text-3xl font-bold">{messages.length}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">معدل الاستجابة</p>
                      <p className="text-3xl font-bold">&lt; 10s</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">التكلفة المتوسطة</p>
                      <p className="text-3xl font-bold">$0.004</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">لا توجد محادثات بعد. ابدأ بالمحادثة مع الوكلاء!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.slice(-5).map((message) => (
                      <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          {message.sender === 'user' ? (
                            <Users className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{message.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{new Date(message.timestamp).toLocaleTimeString('ar-SA')}</span>
                            {message.cost_tracking && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${message.cost_tracking.total_cost.toFixed(4)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masterService.agents.map((agent) => (
                <Card key={agent.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getAgentColor(agent.id)} rounded-xl flex items-center justify-center text-white`}>
                        {getAgentIcon(agent.id)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{agent.arabic_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{agent.specialty}</p>
                        <Badge className={agent.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                          {agent.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        setSelectedAgent(agent.id);
                        setActiveTab('chat');
                      }}
                    >
                      بدء المحادثة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-1 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">اختر الوكيل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {masterService.agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`w-full p-3 rounded-lg text-right transition-colors ${
                        selectedAgent === agent.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getAgentIcon(agent.id)}
                        <span className="text-sm font-medium">{agent.arabic_name}</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAgentIcon(selectedAgent)}
                    محادثة مع {masterService.getAgentById(selectedAgent)?.arabic_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-96 w-full p-4 border rounded-lg">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">ابدأ محادثة جديدة!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                              {message.agents_involved.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {message.agents_involved.map((agentId) => (
                                    <Badge key={agentId} variant="secondary" className="text-xs">
                                      {masterService.getAgentById(agentId)?.arabic_name || agentId}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                                <span>{new Date(message.timestamp).toLocaleTimeString('ar-SA')}</span>
                                {message.cost_tracking && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    ${message.cost_tracking.total_cost.toFixed(4)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading || !isConnected}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isLoading || !isConnected || !inputMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    إحصائيات الاستخدام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>إجمالي المحادثات</span>
                      <span className="font-bold">{messages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>إجمالي التكلفة</span>
                      <span className="font-bold">
                        ${messages.reduce((sum, m) => sum + (m.cost_tracking?.total_cost || 0), 0).toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>إجمالي الرموز المستخدمة</span>
                      <span className="font-bold">
                        {messages.reduce((sum, m) => sum + (m.cost_tracking?.tokens_used || 0), 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    الوكلاء الأكثر استخداماً
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {masterService.agents.slice(0, 5).map((agent) => (
                      <div key={agent.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${getAgentColor(agent.id)} rounded-lg flex items-center justify-center text-white`}>
                          {getAgentIcon(agent.id)}
                        </div>
                        <span className="text-sm font-medium flex-1">{agent.arabic_name}</span>
                        <Badge variant="secondary">
                          {messages.filter(m => m.agents_involved.includes(agent.id)).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
