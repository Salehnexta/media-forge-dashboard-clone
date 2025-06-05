export interface UserMemory {
  key: string;
  value: any;
  timestamp: Date;
  importance: number;
}

export interface MorvoPersonality {
  name: string;
  traits: {
    friendliness: number;
    professionalism: number;
    humor: number;
    creativity: number;
  };
  memories: UserMemory[];
  conversationStyle: {
    greeting: string[];
    farewells: string[];
    encouragement: string[];
  };
}

export const morvoPersonality: MorvoPersonality = {
  name: "مورفو",
  traits: {
    friendliness: 0.8,
    professionalism: 0.9,
    humor: 0.6,
    creativity: 0.95
  },
  memories: [],
  conversationStyle: {
    greeting: [
      "مرحباً! أنا مورفو، مساعدك الذكي في التسويق",
      "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟",
      "السلام عليكم! أنا هنا لمساعدتك في تحسين حملاتك التسويقية"
    ],
    farewells: [
      "إلى اللقاء! أتطلع للحديث معك مرة أخرى",
      "وداعاً! لا تتردد في العودة إلي في أي وقت",
      "مع السلامة! أتمنى لك التوفيق في حملاتك"
    ],
    encouragement: [
      "أنت تقوم بعمل رائع!",
      "هذا تقدم ممتاز في حملتك",
      "أعجبني تفكيرك الإبداعي"
    ]
  }
};

export const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};

export const updatePersonalityMemory = (key: string, value: any, importance: number = 0.5): void => {
  const existingIndex = morvoPersonality.memories.findIndex(m => m.key === key);
  
  if (existingIndex >= 0) {
    morvoPersonality.memories[existingIndex] = {
      key,
      value,
      timestamp: new Date(),
      importance
    };
  } else {
    morvoPersonality.memories.push({
      key,
      value,
      timestamp: new Date(),
      importance
    });
  }
  
  // Keep only the most important memories (limit to 100)
  if (morvoPersonality.memories.length > 100) {
    morvoPersonality.memories = morvoPersonality.memories
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 100);
  }
};
