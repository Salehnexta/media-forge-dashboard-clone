
import { AIManager } from '@/types/morvo';
import { getManagerByType } from '@/utils/managerPersonalities';

interface TypingIndicatorProps {
  currentTypingManager: AIManager;
  getManagerColor: (manager: AIManager) => string;
}

export const TypingIndicator = ({ currentTypingManager, getManagerColor }: TypingIndicatorProps) => {
  const managerInfo = getManagerByType(currentTypingManager);

  return (
    <div className="flex justify-start animate-fadeIn">
      <div className={`w-10 h-10 ${getManagerColor(currentTypingManager)} rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 shadow-lg border-2 border-white`}>
        <span className="text-white text-sm font-medium">
          {managerInfo.avatar}
        </span>
      </div>
      <div className="max-w-[75%]">
        <div className="text-xs font-semibold text-gray-700 mb-1 px-1">
          {managerInfo.name}
        </div>
        <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-600 mb-2">جاري الكتابة...</div>
          <div className="flex space-x-1" role="status" aria-label="جاري الكتابة">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
