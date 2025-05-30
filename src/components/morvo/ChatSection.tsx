
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIManager, ChatMessage } from "@/types/morvo";
import { aiManagers } from "@/data/morvoData";

interface ChatSectionProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

export const ChatSection = ({ selectedManager, onManagerSelect }: ChatSectionProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      manager: selectedManager
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: getAIResponse(selectedManager, inputValue),
      sender: "ai",
      timestamp: new Date(),
      manager: selectedManager
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue("");
  };

  const getAIResponse = (manager: AIManager, message: string): string => {
    const responses = {
      strategic: "كمستشار استراتيجي، أرى أن هذا الأمر يتطلب تحليلاً شاملاً للرؤية العامة والميزانية. دعني أقترح استراتيجية متكاملة...",
      monitor: "مرحباً! كمراقب لوسائل التواصل، ألاحظ اتجاهات مثيرة في المحتوى. دعني أشاركك آخر الإحصائيات والتفاعلات...",
      executor: "كمنفذ للحملات، سأحلل الأداء الحالي وأقترح تحسينات فورية. البيانات تشير إلى فرص تحسين واضحة...",
      creative: "كمبدع، أرى إمكانيات رائعة لقصص مؤثرة! دعني أقترح أفكاراً إبداعية تلامس قلوب الجمهور...",
      analyst: "من منظور تحليلي، البيانات تكشف أنماطاً مثيرة للاهتمام. سأعرض عليك تحليلاً مفصلاً مع توقعات مستقبلية..."
    };
    return responses[manager];
  };

  return (
    <div className="h-full bg-white/10 backdrop-blur-sm border-l border-white/20 flex flex-col">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-2xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
          فريق مورفو الذكي
        </h2>
      </div>

      <Tabs value={selectedManager} onValueChange={(value) => onManagerSelect(value as AIManager)} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 gap-1 m-4 bg-white/20">
          {aiManagers.map((manager) => (
            <TabsTrigger 
              key={manager.id} 
              value={manager.id}
              className="text-xs p-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              {manager.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {aiManagers.map((manager) => (
          <TabsContent key={manager.id} value={manager.id} className="flex-1 flex flex-col m-0">
            <div className="p-4 bg-gradient-to-l from-blue-100 to-purple-100 border-b border-white/20">
              <h3 className="font-bold text-gray-800">{manager.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{manager.description}</p>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages
                .filter(msg => msg.manager === manager.id)
                .map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" 
                        ? "bg-blue-500 text-white" 
                        : "bg-white/80 text-gray-800"
                    }`}>
                      {message.text}
                    </div>
                  </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
