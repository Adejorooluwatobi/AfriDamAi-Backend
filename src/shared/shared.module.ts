import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentService } from './services/environment.service';
import { ValidationService } from './services/validation.service';
import { RateLimitService } from './services/rate-limit.service';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { AppGateway } from './websockets/app.gateway'; // Import AppGateway
import { FileUploadService } from './services/file-upload.service';
import { GoogleMeetService } from '../domain/services/google-meet.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({ // Register JwtModule asynchronously
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production',
        signOptions: { expiresIn: '60s' }, // Adjust as needed
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    EnvironmentService,
    ValidationService,
    RateLimitService,
    AppGateway, // Add AppGateway as a provider
    FileUploadService,
    GoogleMeetService,
  ],
  exports: [
    EnvironmentService,
    ValidationService,
    RateLimitService,
    AppGateway, // Export AppGateway
    FileUploadService,
    GoogleMeetService,
  ],
})
export class SharedModule {}

