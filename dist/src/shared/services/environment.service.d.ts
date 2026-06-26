import { ConfigService } from '@nestjs/config';
export declare class EnvironmentService {
    private configService;
    constructor(configService: ConfigService);
    get jwtSecret(): string;
    get jwtRefreshSecret(): string;
    get databaseUrl(): string;
    get aiServiceUrl(): string;
    get googleKeyFile(): string | undefined;
    get paystackSecretKey(): string;
    get gcsBucketName(): string;
    get flwSecretKey(): string;
    get frontendUrl(): string;
    get backendUrl(): string;
    get port(): number;
    get nodeEnv(): string;
    get isProduction(): boolean;
    get isDevelopment(): boolean;
    private throwMissingEnvError;
}
