
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: () => string;
}

export class RateLimiter {
  private static instances: Map<string, RateLimiter> = new Map();
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  static getInstance(key: string, config: RateLimitConfig): RateLimiter {
    if (!this.instances.has(key)) {
      this.instances.set(key, new RateLimiter(config));
    }
    return this.instances.get(key)!;
  }

  isAllowed(identifier?: string): boolean {
    const key = identifier || this.config.keyGenerator?.() || 'default';
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this key
    let keyRequests = this.requests.get(key) || [];
    
    // Filter out old requests outside the window
    keyRequests = keyRequests.filter(timestamp => timestamp > windowStart);
    
    // Check if we're within the limit
    if (keyRequests.length >= this.config.maxRequests) {
      return false;
    }

    // Add current request
    keyRequests.push(now);
    this.requests.set(key, keyRequests);

    // Clean up old entries periodically
    this.cleanup();

    return true;
  }

  getRemainingRequests(identifier?: string): number {
    const key = identifier || this.config.keyGenerator?.() || 'default';
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const keyRequests = this.requests.get(key) || [];
    const recentRequests = keyRequests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }

  getResetTime(identifier?: string): number {
    const key = identifier || this.config.keyGenerator?.() || 'default';
    const keyRequests = this.requests.get(key) || [];
    
    if (keyRequests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...keyRequests);
    return oldestRequest + this.config.windowMs;
  }

  private cleanup() {
    const now = Date.now();
    
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => 
        timestamp > now - this.config.windowMs
      );
      
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

// Pre-configured rate limiters for common use cases
export const chatRateLimiter = RateLimiter.getInstance('chat', {
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: () => `chat_${Date.now().toString().slice(0, -3)}` // Per minute grouping
});

export const formRateLimiter = RateLimiter.getInstance('form', {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

export const apiRateLimiter = RateLimiter.getInstance('api', {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
});
