// @ts-nocheck
import { EventEmitter } from 'events';

// Advanced caching system with multiple strategies and layers
export class CacheManager extends EventEmitter {
  private caches: Map<string, CacheLayer> = new Map();
  private strategies: Map<string, CacheStrategy> = new Map();
  private config: CacheManagerConfig;
  private metrics: CacheMetrics;
  private cleanupInterval: NodeJS.Timer | null = null;

  constructor(config: CacheManagerConfig = {}) {
    super();
    
    this.config = {
      defaultTTL: 3600000, // 1 hour
      maxMemoryUsage: 500 * 1024 * 1024, // 500MB
      cleanupInterval: 300000, // 5 minutes
      compressionThreshold: 1024, // 1KB
      enableCompression: true,
      enableMetrics: true,
      ...config
    };
    
    this.metrics = new CacheMetrics();
    
    this.initializeDefaultCaches();
    this.initializeDefaultStrategies();
    this.startCleanupTimer();
  }

  // Get value from cache with strategy
  async get<T>(key: string, options: CacheGetOptions = {}): Promise<T | null> {
    const startTime = Date.now();
    const cacheLayer = this.getCacheLayer(options.layer || 'memory');
    
    try {
      // Check if cache is enabled
      if (!this.isCacheEnabled(options)) {
        this.metrics.recordMiss(key, 'disabled');
        return null;
      }
      
      // Try to get from cache
      const result = await cacheLayer.get<T>(key);
      
      if (result !== null) {
        this.metrics.recordHit(key, Date.now() - startTime);
        this.emit('cache:hit', { key, layer: options.layer || 'memory' });
        return result;
      }
      
      this.metrics.recordMiss(key, 'not_found');
      this.emit('cache:miss', { key, layer: options.layer || 'memory' });
      
      return null;
      
    } catch (error) {
      this.metrics.recordError(key, error as Error);
      this.emit('cache:error', { key, error, operation: 'get' });
      return null;
    }
  }

  // Set value in cache with strategy
  async set<T>(key: string, value: T, options: CacheSetOptions = {}): Promise<boolean> {
    const startTime = Date.now();
    const cacheLayer = this.getCacheLayer(options.layer || 'memory');
    const ttl = options.ttl || this.config.defaultTTL;
    
    try {
      // Check if cache is enabled
      if (!this.isCacheEnabled(options)) {
        return false;
      }
      
      // Apply compression if enabled and value is large enough
      let processedValue = value;
      if (this.shouldCompress(value)) {
        processedValue = await this.compressValue(value);
      }
      
      // Set with TTL
      const success = await cacheLayer.set(key, processedValue, ttl);
      
      if (success) {
        this.metrics.recordSet(key, Date.now() - startTime);
        this.emit('cache:set', { key, layer: options.layer || 'memory', ttl });
        
        // Propagate to other layers if configured
        if (options.propagate) {
          await this.propagateToLayers(key, processedValue, ttl, options.layer || 'memory');
        }
      }
      
      return success;
      
    } catch (error) {
      this.metrics.recordError(key, error as Error);
      this.emit('cache:error', { key, error, operation: 'set' });
      return false;
    }
  }

  // Delete from cache
  async delete(key: string, options: CacheDeleteOptions = {}): Promise<boolean> {
    const cacheLayer = this.getCacheLayer(options.layer || 'memory');
    
    try {
      const success = await cacheLayer.delete(key);
      
      if (success) {
        this.emit('cache:delete', { key, layer: options.layer || 'memory' });
        
        // Propagate deletion to other layers
        if (options.propagate) {
          await this.propagateDeletionToLayers(key, options.layer || 'memory');
        }
      }
      
      return success;
      
    } catch (error) {
      this.emit('cache:error', { key, error, operation: 'delete' });
      return false;
    }
  }

  // Clear cache
  async clear(layer?: string): Promise<boolean> {
    try {
      if (layer) {
        const cacheLayer = this.getCacheLayer(layer);
        await cacheLayer.clear();
        this.emit('cache:clear', { layer });
      } else {
        // Clear all layers
        for (const [layerName, cache] of this.caches) {
          await cache.clear();
          this.emit('cache:clear', { layer: layerName });
        }
      }
      
      return true;
      
    } catch (error) {
      this.emit('cache:error', { error, operation: 'clear' });
      return false;
    }
  }

  // Get or set with function (cache-aside pattern)
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: CacheGetSetOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options);
    
    if (cached !== null) {
      return cached;
    }
    
    // Not in cache, fetch and set
    try {
      const value = await fetchFunction();
      
      // Cache the result
      await this.set(key, value, options);
      
      return value;
      
    } catch (error) {
      // If fetch fails, check if we have stale data we can return
      if (options.returnStaleOnError) {
        const stale = await this.getStale<T>(key, options);
        if (stale !== null) {
          this.emit('cache:stale_served', { key });
          return stale;
        }
      }
      
      throw error;
    }
  }

  // Cache with write-through strategy
  async writeThrough<T>(
    key: string,
    value: T,
    writeFunction: (value: T) => Promise<void>,
    options: CacheSetOptions = {}
  ): Promise<boolean> {
    try {
      // Write to persistent storage first
      await writeFunction(value);
      
      // Then cache the value
      return await this.set(key, value, options);
      
    } catch (error) {
      this.emit('cache:error', { key, error, operation: 'write_through' });
      throw error;
    }
  }

  // Cache with write-behind strategy
  async writeBehind<T>(
    key: string,
    value: T,
    writeFunction: (value: T) => Promise<void>,
    options: CacheSetOptions = {}
  ): Promise<boolean> {
    try {
      // Cache the value immediately
      const cached = await this.set(key, value, options);
      
      // Write to persistent storage asynchronously
      setImmediate(async () => {
        try {
          await writeFunction(value);
          this.emit('cache:write_behind_success', { key });
        } catch (error) {
          this.emit('cache:write_behind_error', { key, error });
        }
      });
      
      return cached;
      
    } catch (error) {
      this.emit('cache:error', { key, error, operation: 'write_behind' });
      return false;
    }
  }

  // Refresh cache entry
  async refresh<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: CacheRefreshOptions = {}
  ): Promise<T> {
    try {
      const value = await fetchFunction();
      await this.set(key, value, options);
      
      this.emit('cache:refreshed', { key });
      return value;
      
    } catch (error) {
      this.emit('cache:error', { key, error, operation: 'refresh' });
      throw error;
    }
  }

  // Batch operations
  async getMany<T>(keys: string[], options: CacheGetOptions = {}): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    const cacheLayer = this.getCacheLayer(options.layer || 'memory');
    
    try {
      // Try batch get if supported
      if (cacheLayer.getMany) {
        return await cacheLayer.getMany<T>(keys);
      }
      
      // Fallback to individual gets
      const promises = keys.map(async (key) => {
        const value = await this.get<T>(key, options);
        return [key, value] as [string, T | null];
      });
      
      const resolved = await Promise.all(promises);
      
      for (const [key, value] of resolved) {
        results.set(key, value);
      }
      
      return results;
      
    } catch (error) {
      this.emit('cache:error', { keys, error, operation: 'get_many' });
      return results;
    }
  }

  async setMany<T>(entries: Map<string, T>, options: CacheSetOptions = {}): Promise<boolean> {
    const cacheLayer = this.getCacheLayer(options.layer || 'memory');
    
    try {
      // Try batch set if supported
      if (cacheLayer.setMany) {
        return await cacheLayer.setMany(entries, options.ttl || this.config.defaultTTL);
      }
      
      // Fallback to individual sets
      const promises = Array.from(entries.entries()).map(([key, value]) =>
        this.set(key, value, options)
      );
      
      const results = await Promise.all(promises);
      return results.every(result => result);
      
    } catch (error) {
      this.emit('cache:error', { entries: entries.size, error, operation: 'set_many' });
      return false;
    }
  }

  // Tag-based cache invalidation
  async tag(key: string, tags: string[]): Promise<boolean> {
    try {
      for (const tag of tags) {
        await this.addToTag(tag, key);
      }
      
      this.emit('cache:tagged', { key, tags });
      return true;
      
    } catch (error) {
      this.emit('cache:error', { key, tags, error, operation: 'tag' });
      return false;
    }
  }

  async invalidateByTag(tag: string): Promise<boolean> {
    try {
      const keys = await this.getKeysByTag(tag);
      
      const promises = keys.map(key => this.delete(key));
      await Promise.all(promises);
      
      await this.clearTag(tag);
      
      this.emit('cache:invalidated_by_tag', { tag, count: keys.length });
      return true;
      
    } catch (error) {
      this.emit('cache:error', { tag, error, operation: 'invalidate_by_tag' });
      return false;
    }
  }

  // Cache warming
  async warm(entries: Array<{ key: string; fetchFunction: () => Promise<any>; options?: CacheSetOptions }>): Promise<void> {
    const promises = entries.map(async ({ key, fetchFunction, options = {} }) => {
      try {
        const value = await fetchFunction();
        await this.set(key, value, options);
        this.emit('cache:warmed', { key });
      } catch (error) {
        this.emit('cache:warm_failed', { key, error });
      }
    });
    
    await Promise.all(promises);
  }

  // Cache statistics and monitoring
  getMetrics(): CacheMetricsSnapshot {
    return this.metrics.getSnapshot();
  }

  getLayerInfo(): Map<string, CacheLayerInfo> {
    const info = new Map<string, CacheLayerInfo>();
    
    for (const [name, cache] of this.caches) {
      info.set(name, {
        name,
        type: cache.constructor.name,
        size: cache.size(),
        maxSize: cache.maxSize(),
        hitRate: this.metrics.getHitRate(name),
        lastAccessed: cache.lastAccessed()
      });
    }
    
    return info;
  }

  // Health check
  async healthCheck(): Promise<CacheHealthStatus> {
    const health: CacheHealthStatus = {
      status: 'healthy',
      layers: {},
      issues: []
    };
    
    for (const [name, cache] of this.caches) {
      try {
        const testKey = `__health_check_${Date.now()}`;
        const testValue = 'test';
        
        // Test basic operations
        await cache.set(testKey, testValue, 1000);
        const retrieved = await cache.get(testKey);
        await cache.delete(testKey);
        
        health.layers[name] = {
          status: retrieved === testValue ? 'healthy' : 'degraded',
          latency: 0, // Would measure actual latency
          size: cache.size(),
          hitRate: this.metrics.getHitRate(name)
        };
        
      } catch (error) {
        health.layers[name] = {
          status: 'unhealthy',
          error: error.message
        };
        health.issues.push(`Cache layer '${name}' is unhealthy: ${error.message}`);
      }
    }
    
    // Determine overall health
    const layerStatuses = Object.values(health.layers).map(l => l.status);
    if (layerStatuses.includes('unhealthy')) {
      health.status = 'unhealthy';
    } else if (layerStatuses.includes('degraded')) {
      health.status = 'degraded';
    }
    
    return health;
  }

  // Private methods
  private getCacheLayer(layerName: string): CacheLayer {
    const layer = this.caches.get(layerName);
    if (!layer) {
      throw new Error(`Cache layer '${layerName}' not found`);
    }
    return layer;
  }

  private isCacheEnabled(options: any): boolean {
    if (options.skipCache) return false;
    if (process.env.DISABLE_CACHE === 'true') return false;
    return true;
  }

  private shouldCompress(value: any): boolean {
    if (!this.config.enableCompression) return false;
    
    const serialized = JSON.stringify(value);
    return serialized.length > this.config.compressionThreshold;
  }

  private async compressValue(value: any): Promise<any> {
    // Mock compression - would use actual compression library
    return {
      __compressed: true,
      data: JSON.stringify(value),
      originalSize: JSON.stringify(value).length
    };
  }

  private async decompressValue(value: any): Promise<any> {
    if (value && value.__compressed) {
      return JSON.parse(value.data);
    }
    return value;
  }

  private async getStale<T>(key: string, options: CacheGetOptions): Promise<T | null> {
    // Try to get from different cache layers that might have stale data
    for (const [layerName, cache] of this.caches) {
      if (layerName !== (options.layer || 'memory')) {
        try {
          const stale = await cache.get<T>(key);
          if (stale !== null) {
            return stale;
          }
        } catch {
          // Continue to next layer
        }
      }
    }
    
    return null;
  }

  private async propagateToLayers(key: string, value: any, ttl: number, excludeLayer: string): Promise<void> {
    const promises = Array.from(this.caches.entries())
      .filter(([name]) => name !== excludeLayer)
      .map(([name, cache]) => cache.set(key, value, ttl).catch(() => {})); // Ignore errors
    
    await Promise.all(promises);
  }

  private async propagateDeletionToLayers(key: string, excludeLayer: string): Promise<void> {
    const promises = Array.from(this.caches.entries())
      .filter(([name]) => name !== excludeLayer)
      .map(([name, cache]) => cache.delete(key).catch(() => {})); // Ignore errors
    
    await Promise.all(promises);
  }

  private async addToTag(tag: string, key: string): Promise<void> {
    const tagKey = `__tag:${tag}`;
    const taggedKeys = await this.get<string[]>(tagKey) || [];
    
    if (!taggedKeys.includes(key)) {
      taggedKeys.push(key);
      await this.set(tagKey, taggedKeys, { layer: 'memory' });
    }
  }

  private async getKeysByTag(tag: string): Promise<string[]> {
    const tagKey = `__tag:${tag}`;
    return await this.get<string[]>(tagKey) || [];
  }

  private async clearTag(tag: string): Promise<void> {
    const tagKey = `__tag:${tag}`;
    await this.delete(tagKey);
  }

  private initializeDefaultCaches(): void {
    // Memory cache
    this.caches.set('memory', new MemoryCache({
      maxSize: 1000,
      ttl: this.config.defaultTTL
    }));
    
    // Redis cache (if available)
    if (process.env.REDIS_URL) {
      this.caches.set('redis', new RedisCache({
        url: process.env.REDIS_URL,
        ttl: this.config.defaultTTL
      }));
    }
    
    // File system cache
    this.caches.set('fs', new FileSystemCache({
      directory: './cache',
      ttl: this.config.defaultTTL
    }));
  }

  private initializeDefaultStrategies(): void {
    // Cache-aside
    this.strategies.set('aside', new CacheAsideStrategy());
    
    // Write-through
    this.strategies.set('write-through', new WriteThroughStrategy());
    
    // Write-behind
    this.strategies.set('write-behind', new WriteBehindStrategy());
    
    // Read-through
    this.strategies.set('read-through', new ReadThroughStrategy());
  }

  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  private async performCleanup(): Promise<void> {
    try {
      for (const [name, cache] of this.caches) {
        await cache.cleanup();
      }
      
      this.emit('cache:cleanup_completed');
      
    } catch (error) {
      this.emit('cache:cleanup_error', error);
    }
  }

  // Cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    // Close all cache connections
    for (const cache of this.caches.values()) {
      if (cache.close) {
        cache.close();
      }
    }
    
    this.removeAllListeners();
  }
}

// Memory cache implementation
class MemoryCache implements CacheLayer {
  private store = new Map<string, CacheEntry>();
  private accessOrder = new Map<string, number>();
  private config: MemoryCacheConfig;

  constructor(config: MemoryCacheConfig = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 3600000,
      ...config
    };
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.accessOrder.delete(key);
      return null;
    }
    
    // Update access order
    this.accessOrder.set(key, Date.now());
    
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const expiresAt = Date.now() + (ttl || this.config.ttl);
    
    // Evict if at capacity
    if (this.store.size >= this.config.maxSize && !this.store.has(key)) {
      this.evictLRU();
    }
    
    this.store.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
    
    this.accessOrder.set(key, Date.now());
    
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.store.delete(key);
    this.accessOrder.delete(key);
    return deleted;
  }

  async clear(): Promise<void> {
    this.store.clear();
    this.accessOrder.clear();
  }

  size(): number {
    return this.store.size;
  }

  maxSize(): number {
    return this.config.maxSize;
  }

  lastAccessed(): Date | null {
    const lastAccess = Math.max(...this.accessOrder.values());
    return lastAccess ? new Date(lastAccess) : null;
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        this.accessOrder.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, time] of this.accessOrder) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.store.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }
}

// Mock Redis cache implementation
class RedisCache implements CacheLayer {
  private connected = false;
  
  constructor(config: RedisCacheConfig) {
    // Mock Redis connection
    this.connected = true;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected) return null;
    
    // Mock Redis get
    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.connected) return false;
    
    // Mock Redis set
    return true;
  }

  async delete(key: string): Promise<boolean> {
    if (!this.connected) return false;
    
    // Mock Redis del
    return true;
  }

  async clear(): Promise<void> {
    if (!this.connected) return;
    
    // Mock Redis flushdb
  }

  size(): number {
    return 0; // Would get from Redis
  }

  maxSize(): number {
    return Infinity;
  }

  lastAccessed(): Date | null {
    return new Date();
  }

  async cleanup(): Promise<void> {
    // Redis handles its own cleanup
  }

  close(): void {
    this.connected = false;
  }
}

// File system cache implementation
class FileSystemCache implements CacheLayer {
  private directory: string;
  
  constructor(config: FileSystemCacheConfig) {
    this.directory = config.directory;
    this.ensureDirectory();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const fs = await import('fs/promises');
      const filePath = this.getFilePath(key);
      const content = await fs.readFile(filePath, 'utf8');
      const entry = JSON.parse(content);
      
      if (Date.now() > entry.expiresAt) {
        await fs.unlink(filePath).catch(() => {});
        return null;
      }
      
      return entry.value;
      
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const fs = await import('fs/promises');
      const filePath = this.getFilePath(key);
      const entry = {
        value,
        expiresAt: Date.now() + (ttl || 3600000),
        createdAt: Date.now()
      };
      
      await fs.writeFile(filePath, JSON.stringify(entry));
      return true;
      
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const fs = await import('fs/promises');
      const filePath = this.getFilePath(key);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir(this.directory);
      
      const promises = files
        .filter(file => file.endsWith('.cache'))
        .map(file => fs.unlink(`${this.directory}/${file}`).catch(() => {}));
      
      await Promise.all(promises);
    } catch {
      // Directory might not exist
    }
  }

  size(): number {
    // Would count files in directory
    return 0;
  }

  maxSize(): number {
    return Infinity;
  }

  lastAccessed(): Date | null {
    return new Date();
  }

  async cleanup(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir(this.directory);
      const now = Date.now();
      
      for (const file of files) {
        if (!file.endsWith('.cache')) continue;
        
        try {
          const filePath = `${this.directory}/${file}`;
          const content = await fs.readFile(filePath, 'utf8');
          const entry = JSON.parse(content);
          
          if (now > entry.expiresAt) {
            await fs.unlink(filePath);
          }
        } catch {
          // Skip corrupted files
        }
      }
    } catch {
      // Directory issues
    }
  }

  private getFilePath(key: string): string {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${this.directory}/${sanitizedKey}.cache`;
  }

  private ensureDirectory(): void {
    // Would ensure directory exists
  }
}

// Cache metrics tracking
class CacheMetrics {
  private hits = new Map<string, number>();
  private misses = new Map<string, number>();
  private errors = new Map<string, number>();
  private latencies: number[] = [];
  private operations = new Map<string, number>();

  recordHit(key: string, latency: number): void {
    this.hits.set(key, (this.hits.get(key) || 0) + 1);
    this.latencies.push(latency);
    this.operations.set('hits', (this.operations.get('hits') || 0) + 1);
  }

  recordMiss(key: string, reason: string): void {
    this.misses.set(key, (this.misses.get(key) || 0) + 1);
    this.operations.set('misses', (this.operations.get('misses') || 0) + 1);
  }

  recordSet(key: string, latency: number): void {
    this.latencies.push(latency);
    this.operations.set('sets', (this.operations.get('sets') || 0) + 1);
  }

  recordError(key: string, error: Error): void {
    this.errors.set(key, (this.errors.get(key) || 0) + 1);
    this.operations.set('errors', (this.operations.get('errors') || 0) + 1);
  }

  getHitRate(layer?: string): number {
    const totalHits = this.operations.get('hits') || 0;
    const totalMisses = this.operations.get('misses') || 0;
    const total = totalHits + totalMisses;
    
    return total > 0 ? (totalHits / total) * 100 : 0;
  }

  getSnapshot(): CacheMetricsSnapshot {
    const totalOperations = Array.from(this.operations.values()).reduce((sum, count) => sum + count, 0);
    
    return {
      hits: this.operations.get('hits') || 0,
      misses: this.operations.get('misses') || 0,
      sets: this.operations.get('sets') || 0,
      errors: this.operations.get('errors') || 0,
      hitRate: this.getHitRate(),
      avgLatency: this.latencies.length > 0 ? 
        this.latencies.reduce((sum, lat) => sum + lat, 0) / this.latencies.length : 0,
      totalOperations
    };
  }
}

// Type definitions and interfaces
interface CacheManagerConfig {
  defaultTTL?: number;
  maxMemoryUsage?: number;
  cleanupInterval?: number;
  compressionThreshold?: number;
  enableCompression?: boolean;
  enableMetrics?: boolean;
}

interface CacheLayer {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  size(): number;
  maxSize(): number;
  lastAccessed(): Date | null;
  cleanup(): Promise<void>;
  getMany?<T>(keys: string[]): Promise<Map<string, T | null>>;
  setMany?<T>(entries: Map<string, T>, ttl?: number): Promise<boolean>;
  close?(): void;
}

interface CacheStrategy {
  get<T>(key: string, fetchFunction?: () => Promise<T>): Promise<T | null>;
  set<T>(key: string, value: T, options?: any): Promise<boolean>;
}

interface CacheGetOptions {
  layer?: string;
  skipCache?: boolean;
}

interface CacheSetOptions {
  layer?: string;
  ttl?: number;
  propagate?: boolean;
}

interface CacheDeleteOptions {
  layer?: string;
  propagate?: boolean;
}

interface CacheGetSetOptions extends CacheGetOptions, CacheSetOptions {
  returnStaleOnError?: boolean;
}

interface CacheRefreshOptions extends CacheSetOptions {}

interface CacheEntry {
  value: any;
  expiresAt: number;
  createdAt: number;
}

interface MemoryCacheConfig {
  maxSize?: number;
  ttl?: number;
}

interface RedisCacheConfig {
  url: string;
  ttl?: number;
}

interface FileSystemCacheConfig {
  directory: string;
  ttl?: number;
}

interface CacheMetricsSnapshot {
  hits: number;
  misses: number;
  sets: number;
  errors: number;
  hitRate: number;
  avgLatency: number;
  totalOperations: number;
}

interface CacheLayerInfo {
  name: string;
  type: string;
  size: number;
  maxSize: number;
  hitRate: number;
  lastAccessed: Date | null;
}

interface CacheHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  layers: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency?: number;
    size?: number;
    hitRate?: number;
    error?: string;
  }>;
  issues: string[];
}

// Cache strategy implementations
class CacheAsideStrategy implements CacheStrategy {
  constructor(private cacheManager: CacheManager) {}

  async get<T>(key: string, fetchFunction?: () => Promise<T>): Promise<T | null> {
    return this.cacheManager.getOrSet(key, fetchFunction || (() => Promise.resolve(null as T)));
  }

  async set<T>(key: string, value: T, options?: any): Promise<boolean> {
    return this.cacheManager.set(key, value, options);
  }
}

class WriteThroughStrategy implements CacheStrategy {
  constructor(private cacheManager: CacheManager) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, options?: any): Promise<boolean> {
    // Would implement write-through logic
    return this.cacheManager.set(key, value, options);
  }
}

class WriteBehindStrategy implements CacheStrategy {
  constructor(private cacheManager: CacheManager) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, options?: any): Promise<boolean> {
    // Would implement write-behind logic
    return this.cacheManager.set(key, value, options);
  }
}

class ReadThroughStrategy implements CacheStrategy {
  constructor(private cacheManager: CacheManager) {}

  async get<T>(key: string, fetchFunction?: () => Promise<T>): Promise<T | null> {
    // Would implement read-through logic
    return this.cacheManager.getOrSet(key, fetchFunction || (() => Promise.resolve(null as T)));
  }

  async set<T>(key: string, value: T, options?: any): Promise<boolean> {
    return this.cacheManager.set(key, value, options);
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();