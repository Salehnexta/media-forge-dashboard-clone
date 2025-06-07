
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Bot,
  User,
  Sparkles,
  MessageCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentId?: string;
  type?: 'text' | 'code' | 'component' | 'file';
  metadata?: any;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  description: string;
  isOnline: boolean;
}

const agents: Agent[] = [
  {
    id: 'strategic',
    name: 'سارة الاستراتيجية',
    role: 'المدير الاستراتيجي',
    avatar: '👩‍💼',
    color: 'from-blue-500 to-blue-600',
    description: 'خبيرة التخطيط والاستراتيجية',
    isOnline: true
  },
  {
    id: 'creative',
    name: 'ليلى الإبداعية',
    role: 'مبدعة المحتوى',
    avatar: '🎨',
    color: 'from-purple-500 to-purple-600',
    description: 'متخصصة في المحتوى الإبداعي',
    isOnline: true
  },
  {
    id: 'analyst',
    name: 'أحمد المحلل',
    role: 'محلل البيانات',
    avatar: '📊',
    color: 'from-green-500 to-green-600',
    description: 'خبير تحليل البيانات والأرقام',
    isOnline: true
  },
  {
    id: 'social',
    name: 'نور السوشال',
    role: 'مديرة وسائل التواصل',
    avatar: '📱',
    color: 'from-pink-500 to-pink-600',
    description: 'متخصصة في إدارة المنصات الاجتماعية',
    isOnline: true
  },
  {
    id: 'executor',
    name: 'خالد المنفذ',
    role: 'مدير الحملات',
    avatar: '🚀',
    color: 'from-orange-500 to-orange-600',
    description: 'خبير تنفيذ الحملات الإعلانية',
    isOnline: true
  }
];

export const EnhancedLovableChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        content: `مرحباً! أنا ${selectedAgent.name}، ${selectedAgent.description}. 

كيف يمكنني مساعدتك اليوم؟ يمكنني:
• تحليل استراتيجياتك التسويقية
• تطوير حملات جديدة
• تحسين المحتوى الحالي
• تقديم رؤى مبنية على البيانات

ما هو التحدي الذي تواجهه؟`,
        sender: 'ai',
        timestamp: new Date(),
        agentId: selectedAgent.id,
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info('بدء التسجيل الصوتي...');
    } else {
      toast.success('تم إيقاف التسجيل');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Agent Selector */}
      {showAgents && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 gap-2">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent.id === agent.id ? "default" : "ghost"}
                className={`flex items-center gap-3 justify-start h-auto p-3 ${
                  selectedAgent.id === agent.id 
                    ? `bg-gradient-to-r ${agent.color} text-white shadow-lg` 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedAgent(agent);
                  setShowAgents(false);
                  toast.success(`تم التبديل إلى ${agent.name}`);
                }}
              >
                <span className="text-lg">{agent.avatar}</span>
                <div className="text-right flex-1">
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className="text-xs opacity-75">{agent.role}</div>
                </div>
                {agent.isOnline && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${selectedAgent.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{selectedAgent.avatar}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                مرحباً! أنا {selectedAgent.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedAgent.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">تحليل السوق</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">خطط التسويق</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">استراتيجيات النمو</Badge>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className={`w-8 h-8 bg-gradient-to-r ${selectedAgent.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900 border'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Sparkles className="w-3 h-3" />
                      <span>بواسطة {selectedAgent.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className={`w-8 h-8 bg-gradient-to-r ${selectedAgent.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl p-4 border">
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

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        {/* Agent Selection Button */}
        <div className="mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAgents(!showAgents)}
            className="w-full justify-between bg-white"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{selectedAgent.avatar}</span>
              <span className="text-sm font-medium">{selectedAgent.name}</span>
            </div>
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`اسأل ${selectedAgent.name}...`}
              className="min-h-[48px] max-h-[120px] resize-none bg-white border-gray-200 focus:border-blue-300"
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFileUpload}
              className="w-10 h-10 p-0 bg-white hover:bg-gray-100"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              className={`w-10 h-10 p-0 ${isListening ? 'bg-red-100 border-red-300 text-red-600' : 'bg-white hover:bg-gray-100'}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 p-0 bg-gradient-to-r ${selectedAgent.color} hover:opacity-90`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              toast.success('تم رفع الملف بنجاح');
            }
          }}
        />
      </div>
    </div>
  );
};
