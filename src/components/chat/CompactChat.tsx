
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, MessageCircle, Settings, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentId?: string;
  type?: 'text' | 'code' | 'component';
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  isOnline: boolean;
}

const agents: Agent[] = [
  {
    id: 'content1',
    name: 'وكيل المحتوى الاستراتيجي',
    role: 'استراتيجي',
    avatar: '📝',
    color: 'from-blue-500 to-blue-600',
    isOnline: true
  },
  {
    id: 'content2',
    name: 'وكيل المحتوى الإبداعي',
    role: 'إبداعي',
    avatar: '🎨',
    color: 'from-purple-500 to-purple-600',
    isOnline: true
  },
  {
    id: 'content3',
    name: 'وكيل المحتوى التحليلي',
    role: 'تحليلي',
    avatar: '📊',
    color: 'from-green-500 to-green-600',
    isOnline: true
  },
  {
    id: 'content4',
    name: 'وكيل المحتوى التقني',
    role: 'تقني',
    avatar: '⚙️',
    color: 'from-orange-500 to-orange-600',
    isOnline: true
  }
];

export const CompactChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `مرحباً! أنا ${selectedAgent.name}. كيف يمكنني مساعدتك في إنشاء وتطوير المحتوى اليوم؟`,
        sender: 'ai',
        timestamp: new Date(),
        agentId: selectedAgent.id,
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white" dir="rtl">
      {/* Chat Input Area - في الأسفل كما في التصميم */}
      <div className="p-4 border-b bg-blue-50">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          {/* اختيار الوكيل */}
          <div className="flex gap-2">
            {agents.map(agent => (
              <Button
                key={agent.id}
                variant={selectedAgent.id === agent.id ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  selectedAgent.id === agent.id 
                    ? `bg-gradient-to-r ${agent.color} text-white` 
                    : "text-gray-600 hover:bg-blue-100"
                }`}
                onClick={() => {
                  setSelectedAgent(agent);
                  toast.success(`تم التبديل إلى ${agent.name}`);
                }}
              >
                <span>{agent.avatar}</span>
                <span className="text-xs hidden sm:inline">{agent.role}</span>
                {agent.isOnline && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>

          {/* منطقة الكتابة */}
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`تحدث مع فريق التسويق الذكي المتكامل في منصة Morvo.`}
              className="flex-1 text-sm bg-white border-2 border-blue-200 focus:border-blue-400 rounded-full px-4"
              onKeyPress={handleKeyPress}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className={`bg-gradient-to-r ${selectedAgent.color} hover:opacity-90 rounded-full px-6`}
              size="sm"
            >
              <Send className="w-4 h-4 ml-1" />
              إرسال
            </Button>
          </div>

          {/* أيقونات إضافية */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">مرحباً بك في فريق التسويق الذكي!</h4>
              <p className="text-sm text-gray-600">ابدأ محادثة مع وكلاء المحتوى المتخصصين واحصل على أفضل الحلول التسويقية</p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-r ${selectedAgent.color} text-white text-xs`}>
                    {selectedAgent.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-12'
                      : 'bg-gray-100 text-gray-900 mr-12'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                </div>
                
                <div className={`text-xs text-gray-400 mt-1 ${message.sender === 'user' ? 'text-left' : 'text-right'}`}>
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.sender === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-end">
              <Avatar className="w-8 h-8">
                <AvatarFallback className={`bg-gradient-to-r ${selectedAgent.color} text-white text-xs`}>
                  {selectedAgent.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-2xl p-3 mr-12">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedAgent.name} يكتب...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
