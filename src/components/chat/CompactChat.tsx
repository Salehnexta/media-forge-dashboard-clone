
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
    id: 'strategic',
    name: 'سارة الاستراتيجية',
    role: 'المدير الاستراتيجي',
    avatar: '👩‍💼',
    color: 'from-blue-500 to-blue-600',
    isOnline: true
  },
  {
    id: 'creative',
    name: 'ليلى الإبداعية',
    role: 'مبدعة المحتوى',
    avatar: '🎨',
    color: 'from-purple-500 to-purple-600',
    isOnline: true
  },
  {
    id: 'analyst',
    name: 'أحمد المحلل',
    role: 'محلل البيانات',
    avatar: '📊',
    color: 'from-green-500 to-green-600',
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
        content: `مرحباً! أنا ${selectedAgent.name}. كيف يمكنني مساعدتك في التسويق الرقمي اليوم؟`,
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
      {/* Compact Agent Selector */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="flex gap-2 overflow-x-auto">
          {agents.map(agent => (
            <Button
              key={agent.id}
              variant={selectedAgent.id === agent.id ? "default" : "ghost"}
              size="sm"
              className={`flex items-center gap-2 flex-shrink-0 ${
                selectedAgent.id === agent.id ? 
                `bg-gradient-to-r ${agent.color} text-white shadow-md` : 
                "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setSelectedAgent(agent);
                toast.success(`تم التبديل إلى ${agent.name}`);
              }}
            >
              <span className="text-sm">{agent.avatar}</span>
              <span className="text-xs font-medium">{agent.name}</span>
              {agent.isOnline && <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>}
            </Button>
          ))}
        </div>
      </div>

      {/* Compact Messages Area */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h4 className="font-semibold text-gray-700 mb-2">مرحباً بك!</h4>
              <p className="text-sm text-gray-600">ابدأ محادثة مع فريق مورفو AI</p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className={`w-6 h-6 bg-gradient-to-r ${selectedAgent.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-2.5 rounded-xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900 border'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{selectedAgent.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className={`w-6 h-6 bg-gradient-to-r ${selectedAgent.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-xl p-2.5 border">
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

      {/* Compact Input Area */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`اسأل ${selectedAgent.name}...`}
            className="text-sm bg-white border-gray-200 focus:border-blue-300"
            onKeyPress={handleKeyPress}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={`bg-gradient-to-r ${selectedAgent.color} hover:opacity-90 px-3`}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
