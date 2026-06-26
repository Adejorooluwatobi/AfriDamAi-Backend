"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = CacheService_1 = class CacheService {
    constructor() {
        this.logger = new common_1.Logger(CacheService_1.name);
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000;
        this.cacheTTLs = {
            products: 10 * 60 * 1000,
            categories: 30 * 60 * 1000,
            pricing: 60 * 60 * 1000,
            user_profile: 15 * 60 * 1000,
        };
    }
    async get(key) {
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
    async set(key, data, ttl) {
        const cacheType = key.split(':')[0];
        const cacheTTL = ttl || this.cacheTTLs[cacheType] || this.defaultTTL;
        this.cache.set(key, {
            data,
            expiry: Date.now() + cacheTTL,
        });
        this.logger.debug(`Cache set for key: ${key}, TTL: ${cacheTTL}ms`);
    }
    async delete(key) {
        this.cache.delete(key);
        this.logger.debug(`Cache deleted for key: ${key}`);
    }
    async clear() {
        this.cache.clear();
        this.logger.log('Cache cleared');
    }
    async getOrSet(key, fetcher, ttl) {
        let data = await this.get(key);
        if (data === null) {
            this.logger.debug(`Cache miss for key: ${key}, fetching data`);
            data = await fetcher();
            await this.set(key, data, ttl);
        }
        return data;
    }
    cleanup() {
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
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map