
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';
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
    role: 'وكيل المحتوى',
    avatar: '📝',
    color: 'from-blue-600 to-blue-700',
    isOnline: true
  },
  {
    id: 'content2',
    name: 'وكيل المحتوى الإبداعي',
    role: 'وكيل المحتوى',
    avatar: '🎨',
    color: 'from-purple-600 to-purple-700',
    isOnline: true
  },
  {
    id: 'content3',
    name: 'وكيل المحتوى التحليلي',
    role: 'وكيل المحتوى',
    avatar: '📊',
    color: 'from-green-600 to-green-700',
    isOnline: true
  },
  {
    id: 'content4',
    name: 'وكيل المحتوى التقني',
    role: 'وكيل المحتوى',
    avatar: '⚙️',
    color: 'from-orange-600 to-orange-700',
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
      {/* Agent Selector */}
      <div className="p-4 bg-gradient-to-l from-blue-50 to-purple-50 border-b border-blue-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {agents.map(agent => (
            <Button
              key={agent.id}
              variant={selectedAgent.id === agent.id ? "default" : "ghost"}
              size="sm"
              className={`flex items-center gap-2 flex-shrink-0 transition-all duration-300 ${
                selectedAgent.id === agent.id ? 
                `bg-gradient-to-l ${agent.color} text-white shadow-lg transform scale-105` : 
                "text-gray-700 hover:bg-white hover:shadow-md"
              }`}
              onClick={() => {
                setSelectedAgent(agent);
                toast.success(`تم التبديل إلى ${agent.name}`);
              }}
            >
              <span className="text-base">{agent.avatar}</span>
              <span className="text-sm font-medium">{agent.name}</span>
              {agent.isOnline && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">مرحباً بك!</h4>
              <p className="text-sm text-gray-600">ابدأ محادثة مع وكلاء المحتوى المتخصصين</p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              {message.sender === 'ai' && (
                <div className={`w-8 h-8 bg-gradient-to-br ${selectedAgent.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm shadow-md transition-all duration-300 hover:shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-l from-blue-600 to-blue-700 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Sparkles className="w-3 h-3" />
                      <span>{selectedAgent.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 mt-2 px-2">
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-end">
              <div className={`w-8 h-8 bg-gradient-to-br ${selectedAgent.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{selectedAgent.name} يكتب...</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-l from-blue-50/50 to-purple-50/50">
        <div className="flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`تحدث مع ${selectedAgent.name}...`}
            className="text-sm bg-white border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 rounded-full px-4 py-3 shadow-sm"
            onKeyPress={handleKeyPress}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={`bg-gradient-to-l ${selectedAgent.color} hover:opacity-90 rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
