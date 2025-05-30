
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIManager } from "@/types/morvo";
import { aiManagers } from "@/data/morvoData";

interface ChatSectionProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

export const ChatSection = ({ selectedManager, onManagerSelect }: ChatSectionProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          مرحباً بنا جزء من فريق التسويق الذكي المتكامل في منصة Morvo
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          .Morvo مرحباً بنا جزء من فريق التسويق الذكي المتكامل في منصة
        </p>
        <p className="text-xs text-gray-400 mt-2">11:31 م</p>
      </div>

      {/* Manager selection */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-700 mb-3">
          مرحباً بنا جزء من فريق التسويق الذكي المتكامل في منصة Morvo. يمكنك مساعدتك في إنشاء المخططات والاستراتيجيات وسائل التواصل الاجتماعي. والصور تحدث مع أي من المديرينا الخمسة المتخصصين:
        </p>
        <div className="space-y-2">
          {aiManagers.map((manager) => (
            <button
              key={manager.id}
              onClick={() => onManagerSelect(manager.id)}
              className={`w-full text-right p-2 rounded-lg border transition-colors ${
                selectedManager === manager.id
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{manager.name}</div>
              <div className="text-xs text-gray-500">{manager.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-800">
              مرحباً! أنا الاستراتيجي، مستعد لمساعدتك في وضع الخطط والاستراتيجيات. كيف يمكنني مساعدتك اليوم؟
            </p>
          </div>
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="تحدث مع فريق التسويق الذكي..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          اختر مدیراً من الأعلى للتحدث معه عملیاً، أو اطلب إنشاء محتوى أو تحلیلات
        </p>
      </div>
    </div>
  );
};
