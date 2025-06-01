
interface PooledConnection {
  id: string;
  lastUsed: number;
  inUse: boolean;
  retryCount: number;
}

class ConnectionPool {
  private pool: Map<string, PooledConnection> = new Map();
  private maxConnections: number = 10;
  private connectionTimeout: number = 30000; // 30 seconds
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up idle connections every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [id, connection] of this.pool.entries()) {
      if (!connection.inUse && now - connection.lastUsed > this.connectionTimeout) {
        this.pool.delete(id);
      }
    }
  }

  getConnection(): string {
    // Find an available connection
    for (const [id, connection] of this.pool.entries()) {
      if (!connection.inUse) {
        connection.inUse = true;
        connection.lastUsed = Date.now();
        return id;
      }
    }

    // Create new connection if pool not at max
    if (this.pool.size < this.maxConnections) {
      const id = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.pool.set(id, {
        id,
        lastUsed: Date.now(),
        inUse: true,
        retryCount: 0
      });
      return id;
    }

    // Use oldest available connection
    let oldestId = '';
    let oldestTime = Date.now();
    for (const [id, connection] of this.pool.entries()) {
      if (connection.lastUsed < oldestTime) {
        oldestTime = connection.lastUsed;
        oldestId = id;
      }
    }

    if (oldestId) {
      const connection = this.pool.get(oldestId)!;
      connection.inUse = true;
      connection.lastUsed = Date.now();
      return oldestId;
    }

    // Fallback
    return `fallback_${Date.now()}`;
  }

  releaseConnection(id: string) {
    const connection = this.pool.get(id);
    if (connection) {
      connection.inUse = false;
      connection.lastUsed = Date.now();
    }
  }

  incrementRetry(id: string): number {
    const connection = this.pool.get(id);
    if (connection) {
      connection.retryCount++;
      return connection.retryCount;
    }
    return 0;
  }

  resetRetry(id: string) {
    const connection = this.pool.get(id);
    if (connection) {
      connection.retryCount = 0;
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.pool.clear();
  }
}

export const connectionPool = new ConnectionPool();
