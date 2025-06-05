
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { morvoPersonality, updatePersonalityMemory, UserMemory } from '@/data/morvoPersonality';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  user_id: string;
  content: any;
  created_at: string;
  agent_type: string;
}

export const useMorvoMemory = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save conversation to Supabase (would need conversations table)
  const saveConversation = useCallback(async (conversation: any, agentType: string = 'general') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, store in localStorage until we set up the database table
      const savedConversations = JSON.parse(localStorage.getItem('morvo_conversations') || '[]');
      const newConversation = {
        id: Date.now().toString(),
        user_id: user.id,
        content: conversation,
        created_at: new Date().toISOString(),
        agent_type: agentType
      };
      
      savedConversations.push(newConversation);
      localStorage.setItem('morvo_conversations', JSON.stringify(savedConversations));
      setConversations(savedConversations);
      
      console.log('Conversation saved:', newConversation);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }, []);

  // Remember important user information
  const rememberUserPreference = useCallback((preference: string, value: any, importance: number = 0.7) => {
    updatePersonalityMemory(preference, value, importance);
    
    // Save to localStorage for persistence
    localStorage.setItem('morvo_personality', JSON.stringify(morvoPersonality));
    
    toast.success(`تم حفظ تفضيلك: ${preference}`);
  }, []);

  // Get user memory by key
  const getUserMemory = useCallback((key: string): UserMemory | undefined => {
    return morvoPersonality.memories.find(m => m.key === key);
  }, []);

  // Get all memories sorted by importance
  const getAllMemories = useCallback((): UserMemory[] => {
    return morvoPersonality.memories.sort((a, b) => b.importance - a.importance);
  }, []);

  // Load personality from localStorage on mount
  useEffect(() => {
    const savedPersonality = localStorage.getItem('morvo_personality');
    if (savedPersonality) {
      try {
        const parsed = JSON.parse(savedPersonality);
        morvoPersonality.memories = parsed.memories || [];
      } catch (error) {
        console.error('Error loading personality:', error);
      }
    }
  }, []);

  // Process special commands in chat
  const handleSpecialCommands = useCallback((message: string): boolean => {
    if (message.startsWith('/remember ')) {
      const memoryText = message.replace('/remember ', '').trim();
      rememberUserPreference('user_note', memoryText, 0.8);
      return true;
    }
    
    if (message.startsWith('/forget ')) {
      const forgetKey = message.replace('/forget ', '').trim();
      const index = morvoPersonality.memories.findIndex(m => m.key === forgetKey);
      if (index >= 0) {
        morvoPersonality.memories.splice(index, 1);
        localStorage.setItem('morvo_personality', JSON.stringify(morvoPersonality));
        toast.success(`تم نسيان: ${forgetKey}`);
      }
      return true;
    }

    if (message.startsWith('/create ')) {
      const prompt = message.replace('/create ', '').trim();
      // This would integrate with content creation API
      toast.info(`بدء إنشاء المحتوى: ${prompt}`);
      return true;
    }

    return false;
  }, [rememberUserPreference]);

  // Get contextual greeting based on user history
  const getContextualGreeting = useCallback((): string => {
    const userName = getUserMemory('user_name')?.value;
    const lastInteraction = getUserMemory('last_interaction')?.value;
    
    let greeting = morvoPersonality.conversationStyle.greeting[0];
    
    if (userName) {
      greeting = `مرحباً ${userName}! `;
    }
    
    if (lastInteraction) {
      const lastDate = new Date(lastInteraction);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        greeting += "أراك مرة أخرى اليوم! ";
      } else if (daysDiff === 1) {
        greeting += "أهلاً بعودتك بعد يوم! ";
      } else if (daysDiff > 1) {
        greeting += `أهلاً بعودتك بعد ${daysDiff} أيام! `;
      }
    }
    
    greeting += "كيف يمكنني مساعدتك؟";
    
    // Update last interaction
    rememberUserPreference('last_interaction', new Date().toISOString(), 0.3);
    
    return greeting;
  }, [getUserMemory, rememberUserPreference]);

  return {
    conversations,
    isLoading,
    saveConversation,
    rememberUserPreference,
    getUserMemory,
    getAllMemories,
    handleSpecialCommands,
    getContextualGreeting,
    personality: morvoPersonality
  };
};
