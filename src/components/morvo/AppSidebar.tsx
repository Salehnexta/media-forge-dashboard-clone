
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Bot,
  Send,
  Plus,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIManager } from "@/types/morvo";

interface AppSidebarProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AppSidebar({ selectedManager, onManagerSelect }: AppSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! أنا جزء من فريق التسويق الذكي المتكامل في منصة Morvo. يمكنني مساعدتك في إنشاء المخططات والتحليلات، منشورات وسائل التواصل الاجتماعي، والصور. كيف يمكنني مساعدتك اليوم؟',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `شكراً لك على رسالتك. يمكنني مساعدتك في إنشاء محتوى تسويقي متميز. ما نوع المحتوى الذي تريد إنشاؤه؟`,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: '1',
        text: 'مرحباً! أنا جزء من فريق التسويق الذكي المتكامل في منصة Morvo. يمكنني مساعدتك في إنشاء المخططات والتحليلات، منشورات وسائل التواصل الاجتماعي، والصور. كيف يمكنني مساعدتك اليوم؟',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <Sidebar side="right" className="border-l-0 border-r">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">منصة Morvo</h1>
              <p className="text-xs text-gray-500">فريق التسويق الذكي المتكامل</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={startNewChat}
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col h-full p-0">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white ml-2'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                    <span className="text-xs text-white font-medium">م</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                className="resize-none border-gray-300 rounded-xl pr-4 pl-12 py-3 text-right focus:border-blue-500 focus:ring-blue-500"
                dir="rtl"
              />
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={!inputMessage.trim()}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            يمكن أن تحدث أخطاء. تحقق من المعلومات المهمة.
          </p>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <span className="text-sm font-semibold">م.أ</span>
              </div>
            </div>
            <div className="mr-3 text-right">
              <p className="text-sm font-medium text-gray-700">محمد أحمد</p>
              <p className="text-xs font-medium text-gray-500">الخطة المميزة</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-800">
            مرحباً! ابدأ محادثة جديدة للحصول على المساعدة
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
