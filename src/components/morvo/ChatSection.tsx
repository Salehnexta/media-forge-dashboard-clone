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
export const ChatSection = ({
  selectedManager,
  onManagerSelect
}: ChatSectionProps) => {
  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };
  return <div className="flex flex-col h-screen">
      {/* Chat header - Railway AI Status */}
      

      {/* AI Agents Selection */}
      

      {/* Onboarding Notice */}
      

      {/* New Company Button */}
      <div className="p-4">
        
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
          <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="تحدث مع فريق التسويق الذكي..." className="flex-1" onKeyPress={e => e.key === "Enter" && handleSendMessage()} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          اختر مديراً من الأعلى للتحدث معه، أو اطلب إنشاء محتوى أو تحليلات
        </p>
      </div>
    </div>;
};