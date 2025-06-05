import { DashboardCommand } from '@/types/dashboard';

export interface CommandPattern {
  patterns: string[];
  command: Omit<DashboardCommand, 'confidence'>;
  description: string;
}

export class ChatCommandProcessor {
  private commandPatterns: CommandPattern[] = [
    // Tab switching commands
    {
      patterns: ['حملات', 'campaigns', 'إعلانات', 'ads', 'انتقل للحملات', 'show campaigns'],
      command: { type: 'TAB_CHANGE', payload: { tab: 'executor' } },
      description: 'الانتقال إلى تبويب الحملات الإعلانية'
    },
    {
      patterns: ['محتوى', 'content', 'منشورات', 'posts', 'إبداعي', 'creative'],
      command: { type: 'TAB_CHANGE', payload: { tab: 'creative' } },
      description: 'الانتقال إلى تبويب المحتوى الإبداعي'
    },
    {
      patterns: ['سوشال', 'social', 'تواصل', 'media', 'وسائل التواصل', 'social media'],
      command: { type: 'TAB_CHANGE', payload: { tab: 'monitor' } },
      description: 'الانتقال إلى تبويب وسائل التواصل الاجتماعي'
    },
    {
      patterns: ['تحليلات', 'analytics', 'تحليل', 'analysis', 'بيانات', 'data'],
      command: { type: 'TAB_CHANGE', payload: { tab: 'analyst' } },
      description: 'الانتقال إلى تبويب التحليلات'
    },
    {
      patterns: ['استراتيجي', 'strategic', 'استراتيجية', 'strategy', 'خطة', 'plan'],
      command: { type: 'TAB_CHANGE', payload: { tab: 'strategic' } },
      description: 'الانتقال إلى التبويب الاستراتيجي'
    },
    
    // Data refresh commands
    {
      patterns: ['تحديث', 'refresh', 'أحدث', 'update', 'حدث البيانات', 'refresh data'],
      command: { type: 'DATA_REFRESH', payload: {} },
      description: 'تحديث البيانات'
    },
    {
      patterns: ['إحصائيات', 'stats', 'أرقام', 'numbers', 'مؤشرات', 'metrics'],
      command: { type: 'STATS_UPDATE', payload: { refreshStats: true } },
      description: 'تحديث الإحصائيات'
    },
    
    // Chart creation commands
    {
      patterns: ['اعرض جدول', 'show chart', 'رسم بياني', 'graph', 'إنشاء رسم', 'create chart'],
      command: { type: 'CHART_CREATE', payload: { chartType: 'default' } },
      description: 'إنشاء رسم بياني'
    }
  ];

  detectCommand(message: string): DashboardCommand | null {
    const normalizedMessage = message.toLowerCase().trim();
    let bestMatch: { command: DashboardCommand; confidence: number } | null = null;

    for (const pattern of this.commandPatterns) {
      for (const patternText of pattern.patterns) {
        const confidence = this.calculateConfidence(normalizedMessage, patternText.toLowerCase());
        
        if (confidence > 0.3) { // Minimum confidence threshold
          const command: DashboardCommand = {
            ...pattern.command,
            confidence
          };
          
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = { command, confidence };
          }
        }
      }
    }

    return bestMatch?.command || null;
  }

  private calculateConfidence(message: string, pattern: string): number {
    // Simple confidence calculation based on word matching
    const messageWords = message.split(/\s+/);
    const patternWords = pattern.split(/\s+/);
    
    // Exact match gets highest confidence
    if (message.includes(pattern)) {
      return 1.0;
    }
    
    // Calculate word overlap
    let matchingWords = 0;
    for (const patternWord of patternWords) {
      if (messageWords.some(word => word.includes(patternWord) || patternWord.includes(word))) {
        matchingWords++;
      }
    }
    
    return matchingWords / patternWords.length;
  }

  getCommandSuggestions(): string[] {
    return this.commandPatterns.map(pattern => 
      `${pattern.patterns[0]} - ${pattern.description}`
    );
  }

  validateCommand(command: DashboardCommand): boolean {
    // Basic validation
    return command && 
           typeof command.type === 'string' && 
           command.payload !== undefined &&
           command.confidence >= 0;
  }

  extractParameters(message: string, commandType: string): Record<string, any> {
    // Extract parameters from messages for specific commands
    const params: Record<string, any> = {};
    
    if (commandType === 'CHART_CREATE') {
      // Extract chart type if mentioned
      if (message.includes('دائري') || message.includes('pie')) {
        params.chartType = 'pie';
      } else if (message.includes('خطي') || message.includes('line')) {
        params.chartType = 'line';
      } else if (message.includes('عمودي') || message.includes('bar')) {
        params.chartType = 'bar';
      }
    }
    
    return params;
  }
}

export const chatCommandProcessor = new ChatCommandProcessor();
