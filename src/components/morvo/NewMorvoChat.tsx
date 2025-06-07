
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { morvoApiService, ChatMessage, ChatResponse } from '@/services/MorvoApiService';
import { AGENTS, AgentId } from '@/config/morvoApi';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentId?: string;
}

export const NewMorvoChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentId>('M1');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatRequest: ChatMessage = {
        message: inputMessage,
        agent_id: selectedAgent.toLowerCase(),
        user_id: 'user_123' // Will be replaced with actual user ID from Supabase
      };

      const response: ChatResponse = await morvoApiService.sendChatMessage(chatRequest);

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'agent',
        timestamp: new Date(),
        agentId: response.agent_id
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('فشل في إرسال الرسالة');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        sender: 'agent',
        timestamp: new Date(),
        agentId: selectedAgent.toLowerCase()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAgentInfo = (agentId: string) => {
    const agentKey = agentId.toUpperCase() as AgentId;
    return AGENTS[agentKey] || AGENTS.M1;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">محادثة مع فريق Morvo AI</h3>
              <p className="text-sm text-gray-600">اختر وكيلاً وابدأ المحادثة</p>
            </div>
          </div>
          
          <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value as AgentId)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AGENTS).map(([id, agent]) => (
                <SelectItem key={id} value={id}>
                  <div className="flex items-center gap-2">
                    <span>{agent.emoji}</span>
                    <span className="text-sm">{agent.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="font-bold text-gray-700 mb-2">مرحباً بك في Morvo AI!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  اختر وكيلاً من القائمة أعلاه وابدأ محادثتك
                </p>
                <div className="text-xs text-gray-500">
                  الوكيل المحدد: {AGENTS[selectedAgent].name}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'agent' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${
                    message.agentId ? getAgentInfo(message.agentId).color : 'from-gray-500 to-gray-600'
                  }`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    dir="auto"
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${AGENTS[selectedAgent].color}`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">يكتب...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-sm"
              dir="auto"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
