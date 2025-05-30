
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
}

export const ChatInput = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  onKeyPress, 
  isTyping 
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white shadow-sm">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="اسأل أي سؤال تسويقي... ✨"
            className="w-full border border-gray-300 rounded-2xl pr-4 pl-14 py-4 text-right focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            dir="rtl"
            disabled={isTyping}
            aria-label="رسالة جديدة"
          />
          <button
            onClick={onSendMessage}
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
  );
};
