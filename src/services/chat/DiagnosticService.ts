import { DiagnosticEntry } from './types';

export class DiagnosticService {
  private diagnosticMode = false;
  private connectionHistory: DiagnosticEntry[] = [];
  
  constructor() {
    this.enableDiagnosticMode();
  }

  enableDiagnosticMode(): void {
    this.diagnosticMode = true;
    this.logDiagnostic('service_initialized', { mode: 'production' });
  }

  logDiagnostic(event: string, details?: any): void {
    if (!this.diagnosticMode) return;
    
    const logEntry: DiagnosticEntry = {
      timestamp: new Date(),
      event,
      details
    };
    
    this.connectionHistory.push(logEntry);
    
    // Keep only last 50 entries
    if (this.connectionHistory.length > 50) {
      this.connectionHistory = this.connectionHistory.slice(-50);
    }
    
    console.log(`🔍 [Diagnostic] ${event}:`, details);
  }

  getDiagnosticHistory(): DiagnosticEntry[] {
    return [...this.connectionHistory];
  }

  parseMessageType(data: string): string {
    try {
      const parsed = JSON.parse(data);
      return parsed.type || 'unknown';
    } catch {
      return 'invalid_json';
    }
  }
}
