// @ts-nocheck
import { createClient, RedisClientType } from 'redis';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

class RedisCache {
  private client: RedisClientType | null = null;
  private isConnected = false;
  private fallbackCache = new Map<string, { value: any; expires: number }>();

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      const redisUrl = process.env.REDIS_URL;
      
      if (!redisUrl) {
        console.warn('Redis URL not found, falling back to in-memory cache');
        return;
      }

      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Redis connection failed');
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Redis client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.client = null;
    }
  }

  private getKey(key: string, prefix?: string): string {
    const finalPrefix = prefix || 'omni';
    return `${finalPrefix}:${key}`;
  }

  /**
   * Get value from cache
   */
  async get<T = any>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const fullKey = this.getKey(key, options.prefix);

      if (this.isConnected && this.client) {
        const value = await this.client.get(fullKey);
        if (value) {
          return JSON.parse(value) as T;
        }
      } else {
        // Fallback to in-memory cache
        const cached = this.fallbackCache.get(fullKey);
        if (cached && cached.expires > Date.now()) {
          return cached.value as T;
        } else if (cached && cached.expires <= Date.now()) {
          this.fallbackCache.delete(fullKey);
        }
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options.prefix);
      const ttl = options.ttl || 3600; // Default 1 hour
      const serializedValue = JSON.stringify(value);

      if (this.isConnected && this.client) {
        await this.client.setEx(fullKey, ttl, serializedValue);
      } else {
        // Fallback to in-memory cache
        this.fallbackCache.set(fullKey, {
          value,
          expires: Date.now() + (ttl * 1000)
        });
      }

      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete from cache
   */
  async del(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options.prefix);

      if (this.isConnected && this.client) {
        await this.client.del(fullKey);
      } else {
        this.fallbackCache.delete(fullKey);
      }

      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options.prefix);

      if (this.isConnected && this.client) {
        const exists = await this.client.exists(fullKey);
        return exists === 1;
      } else {
        const cached = this.fallbackCache.get(fullKey);
        return cached ? cached.expires > Date.now() : false;
      }
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Increment a numeric value
   */
  async incr(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getKey(key, options.prefix);

      if (this.isConnected && this.client) {
        const result = await this.client.incr(fullKey);
        
        // Set expiration if provided
        if (options.ttl) {
          await this.client.expire(fullKey, options.ttl);
        }
        
        return result;
      } else {
        // Fallback implementation
        const cached = this.fallbackCache.get(fullKey);
        const currentValue = (cached && cached.expires > Date.now()) ? cached.value : 0;
        const newValue = (typeof currentValue === 'number' ? currentValue : 0) + 1;
        
        this.fallbackCache.set(fullKey, {
          value: newValue,
          expires: Date.now() + ((options.ttl || 3600) * 1000)
        });
        
        return newValue;
      }
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  /**
   * Set if not exists (atomic operation)
   */
  async setNX(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getKey(key, options.prefix);
      const ttl = options.ttl || 3600;

      if (this.isConnected && this.client) {
        const result = await this.client.setNX(fullKey, JSON.stringify(value));
        if (result && ttl > 0) {
          await this.client.expire(fullKey, ttl);
        }
        return result;
      } else {
        // Fallback implementation
        if (this.fallbackCache.has(fullKey)) {
          const cached = this.fallbackCache.get(fullKey);
          if (cached && cached.expires > Date.now()) {
            return false; // Key already exists
          }
        }
        
        this.fallbackCache.set(fullKey, {
          value,
          expires: Date.now() + (ttl * 1000)
        });
        
        return true;
      }
    } catch (error) {
      console.error('Cache setNX error:', error);
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T = any>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    try {
      const fullKeys = keys.map(key => this.getKey(key, options.prefix));

      if (this.isConnected && this.client) {
        const values = await this.client.mGet(fullKeys);
        return values.map(value => value ? JSON.parse(value) as T : null);
      } else {
        // Fallback implementation
        return fullKeys.map(fullKey => {
          const cached = this.fallbackCache.get(fullKey);
          if (cached && cached.expires > Date.now()) {
            return cached.value as T;
          }
          return null;
        });
      }
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  /**
   * Clear all cache entries with prefix
   */
  async clear(prefix?: string): Promise<boolean> {
    try {
      const searchPrefix = this.getKey('*', prefix);

      if (this.isConnected && this.client) {
        const keys = await this.client.keys(searchPrefix);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        // Clear in-memory cache
        const keysToDelete = Array.from(this.fallbackCache.keys())
          .filter(key => key.startsWith(prefix ? `${prefix}:` : 'omni:'));
        
        keysToDelete.forEach(key => this.fallbackCache.delete(key));
      }

      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      if (this.isConnected && this.client) {
        const info = await this.client.info('memory');
        return {
          connected: true,
          redis: true,
          memory: info
        };
      } else {
        return {
          connected: false,
          redis: false,
          fallbackCacheSize: this.fallbackCache.size,
          fallbackEntries: Array.from(this.fallbackCache.keys())
        };
      }
    } catch (error) {
      console.error('Cache stats error:', error);
      return { error: error.message };
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.disconnect();
        this.isConnected = false;
      }
    } catch (error) {
      console.error('Cache disconnect error:', error);
    }
  }
}

// Export singleton instance
export const cache = new RedisCache();

// Export cache utilities
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  analytics: (userId: string, timeRange: string) => `analytics:${userId}:${timeRange}`,
  aiRequest: (userId: string, prompt: string) => `ai:${userId}:${Buffer.from(prompt).toString('base64').slice(0, 32)}`,
  subscription: (userId: string) => `subscription:${userId}`,
  rateLimit: (key: string) => `rate_limit:${key}`,
  session: (sessionId: string) => `session:${sessionId}`,
  content: (contentId: string) => `content:${contentId}`,
  upload: (uploadId: string) => `upload:${uploadId}`
};

// Cache decorators for common use cases
export function cached<T extends (...args: any[]) => Promise<any>>(
  keyFn: (...args: Parameters<T>) => string,
  ttl: number = 3600
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: Parameters<T>) {
      const cacheKey = keyFn(...args);
      
      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute original method
      const result = await method.apply(this, args);
      
      // Store in cache
      await cache.set(cacheKey, result, { ttl });
      
      return result;
    };
  };
}