
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Bot,
  Target,
  MessageSquare,
  BarChart3,
  Brain,
  Users,
  Send
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
      text: 'مرحباً! أنا جزء من فريق التسويق الذكي المتكامل في منصة Morvo. يمكنني مساعدتك في إنشاء المخططات والتحليلات، منشورات وسائل التواصل الاجتماعي، والصور. تحدث مع أي من مديرينا الخمسة المتخصصين!',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const marketingTeam = [
    { 
      id: 'strategic', 
      name: 'أحمد - الاستراتيجي', 
      description: 'مدير التسويق الاستراتيجي', 
      icon: Target 
    },
    { 
      id: 'monitor', 
      name: 'فاطمة - السوشال', 
      description: 'مديرة وسائل التواصل الاجتماعي', 
      icon: MessageSquare 
    },
    { 
      id: 'executor', 
      name: 'محمد - الحملات', 
      description: 'مدير الحملات والأداء', 
      icon: BarChart3 
    },
    { 
      id: 'creative', 
      name: 'نورا - المحتوى', 
      description: 'مديرة المحتوى والإبداع', 
      icon: Brain 
    },
    { 
      id: 'analyst', 
      name: 'خالد - التحليلات', 
      description: 'مدير التحليلات ومراقبة العلامة التجارية', 
      icon: Users 
    },
  ];

  const getManagerIntro = (managerId: string) => {
    const manager = marketingTeam.find(m => m.id === managerId);
    switch(managerId) {
      case 'strategic':
        return 'مرحباً، أنا أحمد، مدير التسويق الاستراتيجي لشركتك. سأكون المسؤول عن وضع الرؤية الشاملة لتسويق علامتك التجارية.';
      case 'monitor':
        return 'أهلاً! أنا فاطمة، سأكون عينك وأذنك على وسائل التواصل الاجتماعي. سأراقب كل ما يُقال عن علامتك التجارية.';
      case 'executor':
        return 'مرحباً، أنا محمد، مسؤول الحملات والأداء. مهمتي أن أتأكد من أن كل ريال تنفقه في التسويق يحقق لك أفضل عائد ممكن.';
      case 'creative':
        return 'أهلاً بك! أنا نورا، مسؤولة عن المحتوى والإبداع. سأساعدك في حكي قصة علامتك التجارية بطريقة تلمس قلوب عملائك.';
      case 'analyst':
        return 'مرحباً، أنا خالد، خبير البيانات والتحليلات. سأكون المسؤول عن تحويل أرقامك إلى رؤى قابلة للتنفيذ.';
      default:
        return 'مرحباً! أنا جزء من فريق التسويق الذكي المتكامل في منصة Morvo.';
    }
  };

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
          text: `شكراً لك على رسالتك. ${getManagerIntro(selectedManager)} كيف يمكنني مساعدتك اليوم؟`,
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

  return (
    <Sidebar side="right" className="border-l-0 border-r">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">منصة Morvo</h1>
            <p className="text-xs text-gray-500">فريق التسويق الذكي المتكامل</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col h-full">
        {/* Manager Selection */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              مرحباً بك في فريق التسويق الذكي المتكامل
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              يمكنك التحدث مع أي من المديرين الخمسة المتخصصين:
            </p>
          </div>
          
          <div className="space-y-2">
            {marketingTeam.map((member) => (
              <button
                key={member.id}
                onClick={() => onManagerSelect(member.id as AIManager)}
                className={`w-full text-right p-3 rounded-lg border transition-all duration-200 ${
                  selectedManager === member.id
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <member.icon
                    className={`h-4 w-4 ${
                      selectedManager === member.id ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                  <div className="font-medium text-sm">{member.name}</div>
                </div>
                <div className="text-xs text-gray-500 text-right">{member.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              onClick={sendMessage}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="تحدث مع فريق التسويق الذكي..."
              className="flex-1 text-right"
              dir="rtl"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            اختر مديراً من الأعلى للتحدث معه مباشرة، أو اطلب إنشاء محتوى أو تحليلات
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
            مرحباً! اختر مديراً من الأعلى للبدء في المحادثة
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
