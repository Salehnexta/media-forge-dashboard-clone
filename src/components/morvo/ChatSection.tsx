
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
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <h3 className="font-semibold text-blue-800">الوكلاء الذكيين - Railway AI</h3>
        </div>
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Railway غير متصل</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">آخر تحقق: ١١:١٦:٠٧ م</p>
        </div>
      </div>

      {/* Manager selection */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          اختر الوكيل الذكي:
        </p>
        <div className="space-y-2">
          {aiManagers.map((manager) => (
            <button
              key={manager.id}
              onClick={() => onManagerSelect(manager.id)}
              className={`w-full text-right p-3 rounded-lg border transition-colors ${
                selectedManager === manager.id
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{manager.name}</div>
                  <div className="text-xs text-gray-500">{manager.description}</div>
                  <div className="text-xs text-green-600 mt-1">جاهز للتشغيل</div>
                </div>
                {selectedManager === manager.id && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                    تشغيل الوكيل
                  </Button>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 space-y-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800 mb-2">
            يرجى إكمال ملف الشركة أولاً من خلال نظام التأهيل
          </p>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start text-sm" size="sm">
            <div className="text-right">
              <div className="font-medium">إضافة شركة جديدة</div>
              <div className="text-xs text-gray-500">ابدأ تحليل شركة جديدة بالذكاء الاصطناعي</div>
            </div>
          </Button>
          
          <Button variant="outline" className="w-full justify-start text-sm" size="sm">
            <div className="text-right">
              <div className="font-medium">تحديث التحليل الحالي</div>
              <div className="text-xs text-gray-500">احصل على تحليل محدث باستخدام أحدث البيانات</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-800">
              مرحباً! أنا {aiManagers.find(m => m.id === selectedManager)?.name}، مستعد لمساعدتك. كيف يمكنني مساعدتك اليوم؟
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
          اختر مديراً من الأعلى للتحدث معه، أو اطلب إنشاء محتوى أو تحليلات
        </p>
      </div>
    </div>
  );
};
