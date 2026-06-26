import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || this.throwMissingEnvError('JWT_SECRET');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') || this.jwtSecret;
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || this.throwMissingEnvError('DATABASE_URL');
  }

  get aiServiceUrl(): string {
    // Priority: Cloud Run Environment Variable -> Fallback Hardcoded URL
    return this.configService.get<string>('AI_SERVICE_URL') || 'https://afridam-ai2-api-wv67uqwlza-uc.a.run.app';
  }

  get googleKeyFile(): string | undefined {
    if (this.isProduction) {
      // 🛡️ CLOUD FIX: Return undefined so Google SDK uses IAM Service Account roles
      // instead of looking for a physical JSON file.
      return undefined; 
    }
    
    // Locally, look for the file or the env variable
    return this.configService.get<string>('GOOGLE_KEY_FILE') || './service-account.json';
  }

  /**
   * 💳 PAYMENT GATEWAY SYNC
   * Transitioning from Flutterwave to Paystack for AfriDam 2026.
   */
  get paystackSecretKey(): string {
    return this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  get gcsBucketName(): string {
    return this.configService.get<string>('GCS_BUCKET_NAME') || 'afridam-clinical-scans';
  }

  get flwSecretKey(): string {
    return this.configService.get<string>('FLW_SECRET_KEY') || '';
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  get backendUrl(): string {
    return this.configService.get<string>('BACKEND_URL') || `http://localhost:${this.port}`;
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get isProduction(): boolean {
    // Checks both the ConfigService and the raw process environment
    return this.nodeEnv === 'production' || process.env.NODE_ENV === 'production';
  }

  get isDevelopment(): boolean {
    return !this.isProduction;
  }

  private throwMissingEnvError(envVar: string): never {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}