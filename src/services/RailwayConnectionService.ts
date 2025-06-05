
import { toast } from 'sonner';

export interface RailwayConnectionStatus {
  isOnline: boolean;
  httpReachable: boolean;
  websocketSupported: boolean;
  lastChecked: Date;
  errorMessage?: string;
  latency?: number;
}

export class RailwayConnectionService {
  private static instance: RailwayConnectionService;
  private railwayBaseUrl = 'https://morvo-ai-v2.up.railway.app';
  private websocketUrl = 'wss://morvo-ai-v2.up.railway.app/ws';
  private status: RailwayConnectionStatus = {
    isOnline: false,
    httpReachable: false,
    websocketSupported: typeof WebSocket !== 'undefined',
    lastChecked: new Date()
  };

  static getInstance(): RailwayConnectionService {
    if (!RailwayConnectionService.instance) {
      RailwayConnectionService.instance = new RailwayConnectionService();
    }
    return RailwayConnectionService.instance;
  }

  async checkRailwayHealth(): Promise<RailwayConnectionStatus> {
    const startTime = Date.now();
    
    try {
      // Test HTTP endpoint first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${this.railwayBaseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        this.status = {
          isOnline: true,
          httpReachable: true,
          websocketSupported: typeof WebSocket !== 'undefined',
          lastChecked: new Date(),
          latency
        };
        
        // Test WebSocket connection if HTTP is working
        await this.testWebSocketConnection();
        
      } else {
        this.status = {
          isOnline: false,
          httpReachable: false,
          websocketSupported: typeof WebSocket !== 'undefined',
          lastChecked: new Date(),
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          latency
        };
      }
      
    } catch (error: any) {
      this.status = {
        isOnline: false,
        httpReachable: false,
        websocketSupported: typeof WebSocket !== 'undefined',
        lastChecked: new Date(),
        errorMessage: this.parseConnectionError(error)
      };
    }
    
    return this.status;
  }

  private async testWebSocketConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const testWs = new WebSocket(`${this.websocketUrl}/test`);
        
        const timeout = setTimeout(() => {
          testWs.close();
          resolve(false);
        }, 5000);

        testWs.onopen = () => {
          clearTimeout(timeout);
          testWs.close();
          resolve(true);
        };

        testWs.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };

      } catch (error) {
        resolve(false);
      }
    });
  }

  private parseConnectionError(error: any): string {
    if (error.name === 'AbortError') {
      return 'انتهت مهلة الاتصال - الخادم لا يستجيب';
    }
    
    if (error.message?.includes('fetch')) {
      return 'فشل في الوصول للخادم - تحقق من الإنترنت';
    }
    
    if (error.code === 'ENOTFOUND') {
      return 'لا يمكن العثور على الخادم';
    }
    
    return error.message || 'خطأ غير معروف في الاتصال';
  }

  getStatus(): RailwayConnectionStatus {
    return this.status;
  }

  async forceReconnect(): Promise<RailwayConnectionStatus> {
    toast.info('جاري فحص الاتصال...');
    const status = await this.checkRailwayHealth();
    
    if (status.isOnline) {
      toast.success('تم الاتصال بالخادم بنجاح');
    } else {
      toast.error(`فشل الاتصال: ${status.errorMessage}`);
    }
    
    return status;
  }
}

export const railwayConnectionService = RailwayConnectionService.getInstance();
