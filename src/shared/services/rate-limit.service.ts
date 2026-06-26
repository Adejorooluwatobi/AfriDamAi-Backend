import { Injectable, BadRequestException } from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitService {
  private readonly limits = new Map<string, RateLimitEntry>();
  
  // Rate limits per operation type
  private readonly rateLimits = {
    AI_ANALYSIS: { requests: 5, windowMs: 60000 }, // 5 requests per minute
    PASSWORD_RESET: { requests: 3, windowMs: 300000 }, // 3 requests per 5 minutes
    LOGIN_ATTEMPT: { requests: 10, windowMs: 900000 }, // 10 attempts per 15 minutes
    FILE_UPLOAD: { requests: 20, windowMs: 60000 }, // 20 uploads per minute
  };

  checkRateLimit(userId: string, operation: keyof typeof this.rateLimits): void {
    const key = `${userId}:${operation}`;
    const limit = this.rateLimits[operation];
    const now = Date.now();
    
    const entry = this.limits.get(key);
    
    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.limits.set(key, {
        count: 1,
        resetTime: now + limit.windowMs
      });
      return;
    }
    
    if (entry.count >= limit.requests) {
      const resetIn = Math.ceil((entry.resetTime - now) / 1000);
      throw new BadRequestException(
        `Rate limit exceeded for ${operation}. Try again in ${resetIn} seconds.`
      );
    }
    
    entry.count++;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}