
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
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">فريق التسويق الذكي</h3>
            <p className="text-sm text-gray-600">منصة Morvo</p>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="grid grid-cols-2 gap-2">
          {agents.map(agent => (
            <Button
              key={agent.id}
              variant={selectedAgent.id === agent.id ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 text-xs ${
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
              <span className="truncate">{agent.role}</span>
              {agent.isOnline && (
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2 text-sm">مرحباً بك!</h4>
              <p className="text-xs text-gray-600">ابدأ محادثة مع الوكلاء المتخصصين</p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className={`bg-gradient-to-r ${selectedAgent.color} text-white text-xs`}>
                    {selectedAgent.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-2 rounded-lg text-xs ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
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
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 justify-end">
              <Avatar className="w-6 h-6">
                <AvatarFallback className={`bg-gradient-to-r ${selectedAgent.color} text-white text-xs`}>
                  {selectedAgent.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">يكتب...</span>
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

      {/* Chat Input */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 text-sm bg-white border border-gray-200 rounded-lg"
            onKeyPress={handleKeyPress}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={`bg-gradient-to-r ${selectedAgent.color} hover:opacity-90 rounded-lg`}
            size="sm"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
