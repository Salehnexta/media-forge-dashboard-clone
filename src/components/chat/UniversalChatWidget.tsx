
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Mic, MicOff, Settings, MessageCircle, Brain, TrendingUp, Target, Palette, BarChart3 } from 'lucide-react';
import { ChatWidgetProps } from './types';
import { useMCPContext } from '@/contexts/MCPContext';
import { environment, AgentId, AgentType, agentIdMap } from '@/config/environment';
import morvoAPI from '@/api/morvoClient';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentId?: AgentId;
  agentName?: string;
  intent?: string;
  confidence?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    type: 'primary' | 'secondary';
  }>;
}

const agentIcons = {
  M1: Brain,
  M2: MessageCircle,
  M3: Target,
  M4: Palette,
  M5: BarChart3
};

const agentColors = {
  M1: 'bg-blue-500',
  M2: 'bg-pink-500',
  M3: 'bg-green-500',
  M4: 'bg-purple-500',
  M5: 'bg-orange-500'
};

export const UniversalChatWidget = ({ className }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentId>('M1');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const { storeMemory, retrieveMemory, shareInsightBetweenAgents } = useMCPContext();

  // Initialize WebSocket connection
  useEffect(() => {
    connectToMorvo();
    initializeSpeechRecognition();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentAgent]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const connectToMorvo = useCallback(() => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      wsRef.current = morvoAPI.connectWebSocket(
        handleWebSocketMessage,
        handleWebSocketError,
        handleWebSocketClose,
        currentAgent
      );

      // Test connection
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          setIsConnected(true);
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to connect to Morvo:', error);
      setIsConnected(false);
    }
  }, [currentAgent]);

  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('Received message from Morvo:', data);
    
    if (data.type === 'agent_response') {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date(),
        agentId: data.agent_id || currentAgent,
        agentName: environment.agents[data.agent_id || currentAgent].name,
        intent: data.intent,
        confidence: data.confidence,
        actions: data.suggested_actions?.map((action: any) => ({
          label: action.label,
          action: () => handleSuggestedAction(action),
          type: action.type || 'secondary'
        }))
      };

      setChatHistory(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Store AI response in memory
      storeMemory(
        agentIdMap[currentAgent],
        'insight',
        {
          response: data.message,
          intent: data.intent,
          confidence: data.confidence,
          timestamp: new Date().toISOString()
        },
        { agentId: currentAgent }
      );
    } else if (data.type === 'typing_indicator') {
      setIsTyping(data.typing);
    } else if (data.type === 'agent_suggestion') {
      // Suggest switching to different agent
      toast.info(`${environment.agents[data.suggested_agent].name} قد يكون أفضل لهذا السؤال`);
    }
  }, [currentAgent, storeMemory]);

  const handleWebSocketError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
    setIsConnected(false);
    toast.error('فقد الاتصال مع مورفو AI');
  }, []);

  const handleWebSocketClose = useCallback(() => {
    setIsConnected(false);
    // Auto-reconnect after 3 seconds
    setTimeout(connectToMorvo, 3000);
  }, [connectToMorvo]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = environment.defaultLanguage === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('خطأ في التعرف على الصوت');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const detectIntent = (message: string): { intent: string; confidence: number; suggestedAgent?: AgentId } => {
    const lowerMessage = message.toLowerCase();
    
    // Arabic intent patterns
    const intentPatterns = {
      strategic: {
        keywords: ['استراتيجية', 'خطة', 'تخطيط', 'منافسين', 'تحليل السوق', 'أهداف'],
        agent: 'M1'
      },
      social: {
        keywords: ['سوشال ميديا', 'فيسبوك', 'انستغرام', 'تويتر', 'تيك توك', 'منشورات', 'محتوى اجتماعي'],
        agent: 'M2'
      },
      campaigns: {
        keywords: ['حملة', 'إعلان', 'ميزانية', 'تحسين', 'تجربة', 'أداء الحملة'],
        agent: 'M3'
      },
      content: {
        keywords: ['محتوى', 'كتابة', 'تصميم', 'فيديو', 'صور', 'إبداعي', 'نص'],
        agent: 'M4'
      },
      analytics: {
        keywords: ['تحليل', 'بيانات', 'إحصائيات', 'تقرير', 'أرقام', 'مؤشرات'],
        agent: 'M5'
      }
    };

    let bestMatch = { intent: 'general', confidence: 0, suggestedAgent: currentAgent };

    for (const [intent, pattern] of Object.entries(intentPatterns)) {
      const matches = pattern.keywords.filter(keyword => 
        lowerMessage.includes(keyword) || message.includes(keyword)
      );
      
      if (matches.length > 0) {
        const confidence = matches.length / pattern.keywords.length;
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent,
            confidence,
            suggestedAgent: pattern.agent as AgentId
          };
        }
      }
    }

    return bestMatch;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    // Detect intent and suggest agent if needed
    const detection = detectIntent(message);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      agentId: currentAgent,
      intent: detection.intent,
      confidence: detection.confidence
    };

    setChatHistory(prev => [...prev, userMessage]);
    
    // Store user message in memory
    await storeMemory(
      agentIdMap[currentAgent],
      'context',
      {
        user_message: message,
        intent: detection.intent,
        confidence: detection.confidence,
        timestamp: new Date().toISOString()
      },
      { agentId: currentAgent }
    );

    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    // Suggest agent switch if confidence is high
    if (detection.suggestedAgent !== currentAgent && detection.confidence > 0.6) {
      toast.info(
        `هذا السؤال قد يكون أنسب لـ ${environment.agents[detection.suggestedAgent].name}`,
        {
          action: {
            label: 'التبديل',
            onClick: () => {
              setCurrentAgent(detection.suggestedAgent!);
              toast.success(`تم التبديل إلى ${environment.agents[detection.suggestedAgent!].name}`);
            }
          }
        }
      );
    }

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        // Send via WebSocket for real-time response
        morvoAPI.sendWebSocketMessage(wsRef.current, currentMessage, 'user_123', currentAgent);
      } else {
        // Fallback to HTTP API
        const response = await morvoAPI.sendMessage(currentMessage, 'user_123', currentAgent);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.message || 'عذراً، لم أتمكن من فهم طلبك. يرجى المحاولة مرة أخرى.',
          sender: 'ai',
          timestamp: new Date(),
          agentId: currentAgent,
          agentName: environment.agents[currentAgent].name
        };

        setChatHistory(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      toast.error('خطأ في إرسال الرسالة');
    }
  };

  const handleSuggestedAction = (action: any) => {
    console.log('Executing suggested action:', action);
    // Implement action handling based on action type
    if (action.type === 'switch_agent') {
      setCurrentAgent(action.agent_id);
    } else if (action.type === 'dashboard_update') {
      // Trigger dashboard update
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('التعرف على الصوت غير مدعوم في هذا المتصفح');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const AgentIcon = agentIcons[currentAgent];

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className || ''}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full w-14 h-14 ${agentColors[currentAgent]} hover:scale-110 transition-all duration-200 shadow-lg`}
        >
          <AgentIcon className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className || ''}`}>
        <Card className="w-80 shadow-xl border-2 border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AgentIcon className={`w-5 h-5 text-white p-1 rounded ${agentColors[currentAgent]}`} />
                <span className="font-medium text-sm">{environment.agents[currentAgent].name}</span>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)}>
                  ↑
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  ✕
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className || ''}`}>
      <Card className="w-96 h-[600px] shadow-2xl border-2 border-gray-200 flex flex-col">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AgentIcon className={`w-6 h-6 text-white p-1.5 rounded-lg ${agentColors[currentAgent]}`} />
              <div>
                <h3 className="font-bold text-sm">{environment.agents[currentAgent].name}</h3>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500">{isConnected ? 'متصل' : 'غير متصل'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                _
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                ✕
              </Button>
            </div>
          </div>
          
          {/* Agent Selector */}
          {showSettings && (
            <div className="mt-3 space-y-2">
              <Select value={currentAgent} onValueChange={(value) => setCurrentAgent(value as AgentId)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(environment.agents).map(([id, agent]) => {
                    const Icon = agentIcons[id as AgentId];
                    return (
                      <SelectItem key={id} value={id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{agent.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <AgentIcon className={`w-16 h-16 mx-auto mb-4 text-white p-4 rounded-2xl ${agentColors[currentAgent]}`} />
              <h4 className="font-bold text-gray-900 mb-2">مرحباً بك!</h4>
              <p className="text-sm text-gray-600 mb-4">
                أنا {environment.agents[currentAgent].name}، كيف يمكنني مساعدتك اليوم؟
              </p>
            </div>
          )}

          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <AgentIcon className={`w-4 h-4 text-white p-1 rounded ${agentColors[msg.agentId || currentAgent]}`} />
                    <span className="text-xs text-gray-500">{msg.agentName}</span>
                    {msg.confidence && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(msg.confidence * 100)}%
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? `${agentColors[currentAgent]} text-white`
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  
                  {msg.actions && (
                    <div className="flex gap-2 mt-2">
                      {msg.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={action.type === 'primary' ? 'default' : 'outline'}
                          className="text-xs"
                          onClick={action.action}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <AgentIcon className={`w-4 h-4 text-white p-1 rounded ${agentColors[currentAgent]}`} />
                  <span className="text-sm text-gray-600">يكتب...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`اسأل ${environment.agents[currentAgent].name}...`}
              className="resize-none min-h-[44px] max-h-[100px]"
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleVoiceInput}
                variant="outline"
                size="sm"
                className={isListening ? 'bg-red-100 border-red-300' : ''}
                disabled={isTyping}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                size="sm"
                className={`${agentColors[currentAgent]} hover:opacity-90`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
