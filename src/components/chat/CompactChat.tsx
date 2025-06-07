
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, MessageCircle, Loader2 } from 'lucide-react';
import { morvoApiService, ChatMessage, ChatResponse } from '@/services/MorvoApiService';
import { AGENTS, AgentId } from '@/config/morvoApi';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentId?: string;
  type?: 'text' | 'code' | 'component';
}

export const CompactChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentId>('M1');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

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

    try {
      const chatRequest: ChatMessage = {
        message: input,
        agent_id: selectedAgent.toLowerCase(),
        user_id: 'user_123'
      };

      const response: ChatResponse = await morvoApiService.sendChatMessage(chatRequest);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: 'ai',
        timestamp: new Date(),
        agentId: response.agent_id,
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `مرحباً! أنا ${AGENTS[selectedAgent].name}. أعتذر، يبدو أن هناك مشكلة في الاتصال حالياً. كيف يمكنني مساعدتك؟`,
        sender: 'ai',
        timestamp: new Date(),
        agentId: selectedAgent.toLowerCase(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentInfo = (agentId: string) => {
    const agentKey = agentId.toUpperCase() as AgentId;
    return AGENTS[agentKey] || AGENTS.M1;
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
            <h3 className="font-bold text-gray-900">فريق Morvo AI</h3>
            <p className="text-sm text-gray-600">النظام الجديد</p>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(AGENTS).map(([id, agent]) => (
            <Button
              key={id}
              variant={selectedAgent === id ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 text-xs ${
                selectedAgent === id 
                  ? `bg-gradient-to-r ${agent.color} text-white` 
                  : "text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => {
                setSelectedAgent(id as AgentId);
                toast.success(`تم التبديل إلى ${agent.name}`);
              }}
            >
              <span>{agent.emoji}</span>
              <span className="truncate">{id}</span>
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
              <p className="text-xs text-gray-600">ابدأ محادثة مع {AGENTS[selectedAgent].name}</p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className={`bg-gradient-to-r ${
                    message.agentId ? getAgentInfo(message.agentId).color : AGENTS[selectedAgent].color
                  } text-white text-xs`}>
                    {message.agentId ? getAgentInfo(message.agentId).emoji : AGENTS[selectedAgent].emoji}
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
                  <p className="leading-relaxed" dir="auto">{message.content}</p>
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
                <AvatarFallback className={`bg-gradient-to-r ${AGENTS[selectedAgent].color} text-white text-xs`}>
                  {AGENTS[selectedAgent].emoji}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs text-gray-600">يكتب...</span>
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
            disabled={isTyping}
            dir="auto"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className={`bg-gradient-to-r ${AGENTS[selectedAgent].color} hover:opacity-90 rounded-lg`}
            size="sm"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
