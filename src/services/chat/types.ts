
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  manager?: string;
  isCommand?: boolean;
}

export interface WebSocketConfig {
  onMessage?: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

export interface DiagnosticEntry {
  timestamp: Date;
  event: string;
  details?: any;
}

export interface ConnectionStatus {
  success: boolean;
  details: any;
}
