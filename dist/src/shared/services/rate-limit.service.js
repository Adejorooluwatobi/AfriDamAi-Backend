"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
let RateLimitService = class RateLimitService {
    constructor() {
        this.limits = new Map();
        this.rateLimits = {
            AI_ANALYSIS: { requests: 5, windowMs: 60000 },
            PASSWORD_RESET: { requests: 3, windowMs: 300000 },
            LOGIN_ATTEMPT: { requests: 10, windowMs: 900000 },
            FILE_UPLOAD: { requests: 20, windowMs: 60000 },
        };
    }
    checkRateLimit(userId, operation) {
        const key = `${userId}:${operation}`;
        const limit = this.rateLimits[operation];
        const now = Date.now();
        const entry = this.limits.get(key);
        if (!entry || now > entry.resetTime) {
            this.limits.set(key, {
                count: 1,
                resetTime: now + limit.windowMs
            });
            return;
        }
        if (entry.count >= limit.requests) {
            const resetIn = Math.ceil((entry.resetTime - now) / 1000);
            throw new common_1.BadRequestException(`Rate limit exceeded for ${operation}. Try again in ${resetIn} seconds.`);
        }
        entry.count++;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.limits.entries()) {
            if (now > entry.resetTime) {
                this.limits.delete(key);
            }
        }
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = __decorate([
    (0, common_1.Injectable)()
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map