import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cache = new Map<string, CacheEntry<any>>();
  
  // Cache TTL in milliseconds
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly cacheTTLs = {
    products: 10 * 60 * 1000, // 10 minutes
    categories: 30 * 60 * 1000, // 30 minutes
    pricing: 60 * 60 * 1000, // 1 hour
    user_profile: 15 * 60 * 1000, // 15 minutes
  };

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    this.logger.debug(`Cache hit for key: ${key}`);
    return entry.data;
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const cacheType = key.split(':')[0] as keyof typeof this.cacheTTLs;
    const cacheTTL = ttl || this.cacheTTLs[cacheType] || this.defaultTTL;
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + cacheTTL,
    });
    
    this.logger.debug(`Cache set for key: ${key}, TTL: ${cacheTTL}ms`);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.logger.debug(`Cache deleted for key: ${key}`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  // Helper methods for common cache patterns
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    let data = await this.get<T>(key);
    
    if (data === null) {
      this.logger.debug(`Cache miss for key: ${key}, fetching data`);
      data = await fetcher();
      await this.set(key, data, ttl);
    }
    
    return data;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      this.logger.debug(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}