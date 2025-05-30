
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Bot, Send, Plus } from "lucide-react";
import { AIManager } from "@/types/morvo";
import { analyzeQuestion } from "@/utils/chatLogic";
import { getManagerByType, generateDetailedResponse } from "@/utils/managerPersonalities";

interface AppSidebarProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  manager?: AIManager;
}

export function AppSidebar({
  selectedManager,
  onManagerSelect
}: AppSidebarProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'مرحباً! نحن فريق التسويق الذكي المتكامل في منصة Morvo. اسأل أي سؤال وسيجيب عليك المتخصص المناسب تلقائياً! 🚀',
    sender: 'ai',
    timestamp: new Date(),
    manager: 'strategic'
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingManager, setCurrentTypingManager] = useState<AIManager | null>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      const question = inputMessage;
      setInputMessage('');

      // Analyze question and determine appropriate manager
      const appropriateManager = analyzeQuestion(question);
      setCurrentTypingManager(appropriateManager);
      setIsTyping(true);

      // Update selected manager in parent component
      onManagerSelect(appropriateManager);

      // Simulate AI response with typing delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateDetailedResponse(appropriateManager, question),
          sender: 'ai',
          timestamp: new Date(),
          manager: appropriateManager
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
        setCurrentTypingManager(null);
      }, 2000);
    }
  }, [inputMessage, onManagerSelect]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  const startNewChat = useCallback(() => {
    setMessages([{
      id: '1',
      text: 'مرحباً! نحن فريق التسويق الذكي المتكامل في منصة Morvo. اسأل أي سؤال وسيجيب عليك المتخصص المناسب تلقائياً! 🚀',
      sender: 'ai',
      timestamp: new Date(),
      manager: 'strategic'
    }]);
    onManagerSelect('strategic');
  }, [onManagerSelect]);

  const getManagerColor = useCallback((manager: AIManager) => {
    const colors = {
      strategic: 'bg-gradient-to-br from-blue-500 to-blue-600',
      monitor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      executor: 'bg-gradient-to-br from-green-500 to-green-600',
      creative: 'bg-gradient-to-br from-purple-500 to-purple-600',
      analyst: 'bg-gradient-to-br from-orange-500 to-orange-600'
    };
    return colors[manager];
  }, []);

  const getManagerInfo = useCallback((manager: AIManager) => {
    return getManagerByType(manager);
  }, []);

  return (
    <div className="w-80 h-screen bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">منصة Morvo</h1>
              <p className="text-xs text-gray-500">فريق التسويق الذكي المتكامل</p>
            </div>
          </div>
          <button
            onClick={startNewChat}
            className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all duration-200"
            aria-label="بدء محادثة جديدة"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
              {message.sender === 'ai' && message.manager && (
                <div className={`w-10 h-10 ${getManagerColor(message.manager)} rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg border-2 border-white`}>
                  <span className="text-white text-sm font-medium">
                    {getManagerInfo(message.manager).avatar}
                  </span>
                </div>
              )}
              
              <div className={`max-w-[75%] relative ${message.sender === 'user' ? 'ml-3' : ''}`}>
                {message.sender === 'ai' && message.manager && (
                  <div className="text-xs font-semibold text-gray-700 mb-1 px-1">
                    {getManagerInfo(message.manager).name}
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl shadow-sm relative transition-all duration-200 hover:shadow-md group-hover:shadow-lg ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-2 rounded-br-md' 
                    : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line break-words">
                    {message.text}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="flex items-center justify-end mt-2 gap-1">
                      <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                      <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                    </div>
                  )}
                </div>
                
                <div className={`text-xs mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  message.sender === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0 shadow-lg border-2 border-white">
                  <span className="text-sm text-white font-semibold">م</span>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && currentTypingManager && (
            <div className="flex justify-start animate-pulse">
              <div className={`w-10 h-10 ${getManagerColor(currentTypingManager)} rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg border-2 border-white`}>
                <span className="text-white text-sm font-medium">
                  {getManagerInfo(currentTypingManager).avatar}
                </span>
              </div>
              <div className="max-w-[75%]">
                <div className="text-xs font-semibold text-gray-700 mb-1 px-1">
                  {getManagerInfo(currentTypingManager).name}
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-600 mb-2">جاري الكتابة...</div>
                  <div className="flex space-x-1" role="status" aria-label="جاري الكتابة">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white shadow-sm">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اسأل أي سؤال تسويقي... ✨"
                className="w-full border border-gray-300 rounded-2xl pr-4 pl-14 py-4 text-right focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                dir="rtl"
                disabled={isTyping}
                aria-label="رسالة جديدة"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                aria-label="إرسال الرسالة"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
            سيرد عليك المتخصص المناسب تلقائياً حسب نوع سؤالك
          </p>
        </div>
      </div>
    </div>
  );
}
