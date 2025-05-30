
import { Message, AIManager } from '@/types/morvo';
import { getManagerByType } from '@/utils/managerPersonalities';

interface MessageItemProps {
  message: Message;
  getManagerColor: (manager: AIManager) => string;
  formatTime: (date: Date) => string;
}

export const MessageItem = ({ message, getManagerColor, formatTime }: MessageItemProps) => {
  const isUser = message.sender === 'user';
  const managerInfo = message.manager ? getManagerByType(message.manager) : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {!isUser && message.manager && (
        <div className={`w-10 h-10 ${getManagerColor(message.manager)} rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg border-2 border-white`}>
          <span className="text-white text-sm font-medium">
            {managerInfo?.avatar}
          </span>
        </div>
      )}
      
      <div className={`max-w-[75%] relative ${isUser ? 'ml-3' : ''}`}>
        {!isUser && managerInfo && (
          <div className="text-xs font-semibold text-gray-700 mb-1 px-1">
            {managerInfo.name}
          </div>
        )}
        
        <div className={`p-4 rounded-2xl shadow-sm relative transition-all duration-200 hover:shadow-md ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-2 rounded-br-md' 
            : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-line break-words">
            {message.text}
          </div>
          
          {isUser && (
            <div className="flex items-center justify-end mt-2 gap-1">
              <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
              <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className={`text-xs mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isUser ? 'text-right text-gray-500' : 'text-left text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0 shadow-lg border-2 border-white">
          <span className="text-sm text-white font-semibold">م</span>
        </div>
      )}
    </div>
  );
};
