
import { toast } from 'sonner';

export interface RailwayConnectionStatus {
  isOnline: boolean;
  httpReachable: boolean;
  websocketSupported: boolean;
  lastChecked: Date;
  errorMessage?: string;
  latency?: number;
  fallbackMode?: boolean;
}

export class RailwayConnectionService {
  private static instance: RailwayConnectionService;
  private railwayBaseUrl = 'https://morvo-production.up.railway.app';
  private websocketUrl = 'wss://morvo-production.up.railway.app/ws';
  private fallbackMode = false;
  private status: RailwayConnectionStatus = {
    isOnline: false,
    httpReachable: false,
    websocketSupported: typeof WebSocket !== 'undefined',
    lastChecked: new Date(),
    fallbackMode: false
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
          'Content-Type': 'application/json',
          'X-API-Key': 'fallback-development-key'
        }
      });
      
      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        this.fallbackMode = false;
        this.status = {
          isOnline: true,
          httpReachable: true,
          websocketSupported: typeof WebSocket !== 'undefined',
          lastChecked: new Date(),
          latency,
          fallbackMode: false
        };
        
        // Test WebSocket connection if HTTP is working
        await this.testWebSocketConnection();
        
      } else if (response.status === 401 || response.status === 403) {
        // API key error - enable fallback mode
        this.fallbackMode = true;
        this.status = {
          isOnline: false,
          httpReachable: false,
          websocketSupported: typeof WebSocket !== 'undefined',
          lastChecked: new Date(),
          errorMessage: 'API key authentication failed - using fallback mode',
          latency,
          fallbackMode: true
        };
      } else {
        this.status = {
          isOnline: false,
          httpReachable: false,
          websocketSupported: typeof WebSocket !== 'undefined',
          lastChecked: new Date(),
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          latency,
          fallbackMode: this.fallbackMode
        };
      }
      
    } catch (error: any) {
      this.fallbackMode = true;
      this.status = {
        isOnline: false,
        httpReachable: false,
        websocketSupported: typeof WebSocket !== 'undefined',
        lastChecked: new Date(),
        errorMessage: this.parseConnectionError(error),
        fallbackMode: true
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

  isInFallbackMode(): boolean {
    return this.fallbackMode;
  }

  async forceReconnect(): Promise<RailwayConnectionStatus> {
    this.fallbackMode = false; // Reset fallback mode
    toast.info('جاري فحص الاتصال...');
    const status = await this.checkRailwayHealth();
    
    if (status.isOnline) {
      toast.success('تم الاتصال بالخادم بنجاح');
    } else if (status.fallbackMode) {
      toast.warning('يعمل النظام في الوضع المحلي');
    } else {
      toast.error(`فشل الاتصال: ${status.errorMessage}`);
    }
    
    return status;
  }
}

export const railwayConnectionService = RailwayConnectionService.getInstance();
