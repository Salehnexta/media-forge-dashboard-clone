
import { Bot, Plus } from 'lucide-react';

interface ChatHeaderProps {
  onStartNewChat: () => void;
}

export const ChatHeader = ({ onStartNewChat }: ChatHeaderProps) => {
  return (
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
          onClick={onStartNewChat}
          className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all duration-200"
          aria-label="بدء محادثة جديدة"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
