
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
      {/* Chat header - Railway AI Status */}
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

      {/* AI Agents Selection */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-700 mb-3 font-medium">
          اختر الوكيل الذكي:
        </p>
        <div className="space-y-3">
          {/* Strategic Agent */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium text-sm text-gray-800">الاستراتيجي</div>
                <div className="text-xs text-gray-500">يخطط للرؤية والأولويات الخاصة بالميزانية</div>
                <div className="text-xs text-green-600 mt-1">جاهز للتشغيل</div>
              </div>
            </div>
          </div>

          {/* Monitor Agent */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium text-sm text-gray-800">المراقب</div>
                <div className="text-xs text-gray-500">يراقب وسائل التواصل ويحلل تفاعل الجمهور</div>
                <div className="text-xs text-green-600 mt-1">جاهز للتشغيل</div>
              </div>
            </div>
          </div>

          {/* Executor Agent */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium text-sm text-gray-800">المنفذ</div>
                <div className="text-xs text-gray-500">يدير الحملات ويحسن الأداء تلقائياً</div>
                <div className="text-xs text-green-600 mt-1">جاهز للتشغيل</div>
              </div>
            </div>
          </div>

          {/* Creative Agent with Blue Background (Active) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium text-sm text-blue-800">المبدع</div>
                <div className="text-xs text-blue-600">ينتج المحتوى ويضع استراتيجيات إبداعية</div>
                <div className="text-xs text-green-600 mt-1">جاهز للتشغيل</div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                تشغيل الوكيل
              </Button>
            </div>
          </div>

          {/* Analyst Agent */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium text-sm text-gray-800">المحلل</div>
                <div className="text-xs text-gray-500">يجمع البيانات ويكتشف النتائج ويقدم توقعات</div>
                <div className="text-xs text-green-600 mt-1">جاهز للتشغيل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Notice */}
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            يرجى إكمال ملف الشركة أولاً من خلال نظام التأهيل
          </p>
        </div>
      </div>

      {/* New Company Button */}
      <div className="p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">إضافة شركة جديدة</h4>
          <p className="text-xs text-gray-500 mb-3">
            ابدأ تحليل شركة جديدة بالذكاء الاصطناعي واحصل على استراتيجية تسويقية مخصصة
          </p>
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={() => console.log("Add new company")}
          >
            إضافة شركة جديدة
          </Button>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-800">
              مرحباً! أنا المبدع، مستعد لمساعدتك في إنتاج المحتوى الإبداعي. كيف يمكنني مساعدتك اليوم؟
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
