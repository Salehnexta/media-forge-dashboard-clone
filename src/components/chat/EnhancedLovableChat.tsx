
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Smile, 
  Settings, 
  MoreVertical,
  Bot,
  User,
  Sparkles,
  Zap,
  Code,
  FileText,
  Image as ImageIcon
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
    color: 'bg-blue-500',
    description: 'خبيرة التخطيط والاستراتيجية',
    isOnline: true
  },
  {
    id: 'creative',
    name: 'ليلى الإبداعية',
    role: 'مبدعة المحتوى',
    avatar: '🎨',
    color: 'bg-purple-500',
    description: 'متخصصة في المحتوى الإبداعي',
    isOnline: true
  },
  {
    id: 'analyst',
    name: 'أحمد المحلل',
    role: 'محلل البيانات',
    avatar: '📊',
    color: 'bg-green-500',
    description: 'خبير تحليل البيانات والأرقام',
    isOnline: true
  },
  {
    id: 'social',
    name: 'نور السوشال',
    role: 'مديرة وسائل التواصل',
    avatar: '📱',
    color: 'bg-pink-500',
    description: 'متخصصة في إدارة المنصات الاجتماعية',
    isOnline: true
  },
  {
    id: 'executor',
    name: 'خالد المنفذ',
    role: 'مدير الحملات',
    avatar: '🚀',
    color: 'bg-orange-500',
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
        content: `مرحباً! أنا ${selectedAgent.name}، ${selectedAgent.description}. كيف يمكنني مساعدتك اليوم؟`,
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
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className={`${selectedAgent.color} text-white text-lg`}>
                  {selectedAgent.avatar}
                </AvatarFallback>
              </Avatar>
              {selectedAgent.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedAgent.name}</h3>
              <p className="text-sm text-gray-600">{selectedAgent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAgents(!showAgents)}
            >
              <Bot className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Agent Selector */}
        {showAgents && (
          <div className="mt-4 p-3 bg-white rounded-lg border shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent.id === agent.id ? "default" : "ghost"}
                  className="flex items-center gap-2 justify-start h-auto p-3"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setShowAgents(false);
                    toast.success(`تم التبديل إلى ${agent.name}`);
                  }}
                >
                  <span className="text-lg">{agent.avatar}</span>
                  <div className="text-right">
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs opacity-70">{agent.role}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{selectedAgent.avatar}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                مرحباً! أنا {selectedAgent.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedAgent.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">تحليل السوق</Badge>
                <Badge variant="secondary">خطط التسويق</Badge>
                <Badge variant="secondary">استراتيجيات النمو</Badge>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'code' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4" />
                      <span className="text-xs font-medium">كود</span>
                    </div>
                  )}
                  
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <Sparkles className="w-3 h-3" />
                      <span>بواسطة {selectedAgent.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedAgent.avatar}</span>
                  <span className="text-sm text-gray-600">يكتب...</span>
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
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`اسأل ${selectedAgent.name}...`}
              className="min-h-[44px] max-h-[120px] resize-none"
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFileUpload}
              className="w-10 h-10 p-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceInput}
              className={`w-10 h-10 p-0 ${isListening ? 'bg-red-100 border-red-300' : ''}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 p-0"
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
