
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { AIManager } from "@/types/morvo";
import { analyzeQuestion } from "@/utils/chatLogic";
import { generateDetailedResponse } from "@/utils/managerPersonalities";
import { ChatHeader } from './chat/ChatHeader';
import { MessageItem } from './chat/MessageItem';
import { TypingIndicator } from './chat/TypingIndicator';
import { ChatInput } from './chat/ChatInput';

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

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

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

  return (
    <div className="w-80 h-screen bg-white border-l border-gray-200 flex flex-col">
      <ChatHeader onStartNewChat={startNewChat} />
      
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              getManagerColor={getManagerColor}
              formatTime={formatTime}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && currentTypingManager && (
            <TypingIndicator
              currentTypingManager={currentTypingManager}
              getManagerColor={getManagerColor}
            />
          )}
        </div>

        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={sendMessage}
          onKeyPress={handleKeyPress}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}
