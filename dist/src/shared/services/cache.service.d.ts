export declare class CacheService {
    private readonly logger;
    private readonly cache;
    private readonly defaultTTL;
    private readonly cacheTTLs;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, data: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>;
    cleanup(): void;
    getStats(): {
        size: number;
        keys: string[];
    };
}
