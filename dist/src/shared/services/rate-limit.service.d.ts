export declare class RateLimitService {
    private readonly limits;
    private readonly rateLimits;
    checkRateLimit(userId: string, operation: keyof typeof this.rateLimits): void;
    cleanup(): void;
}
