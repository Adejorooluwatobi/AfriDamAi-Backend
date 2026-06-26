"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EnvironmentService = class EnvironmentService {
    constructor(configService) {
        this.configService = configService;
    }
    get jwtSecret() {
        return this.configService.get('JWT_SECRET') || this.throwMissingEnvError('JWT_SECRET');
    }
    get jwtRefreshSecret() {
        return this.configService.get('JWT_REFRESH_SECRET') || this.jwtSecret;
    }
    get databaseUrl() {
        return this.configService.get('DATABASE_URL') || this.throwMissingEnvError('DATABASE_URL');
    }
    get aiServiceUrl() {
        return this.configService.get('AI_SERVICE_URL') || 'https://afridam-ai2-api-wv67uqwlza-uc.a.run.app';
    }
    get googleKeyFile() {
        if (this.isProduction) {
            return undefined;
        }
        return this.configService.get('GOOGLE_KEY_FILE') || './service-account.json';
    }
    get paystackSecretKey() {
        return this.configService.get('PAYSTACK_SECRET_KEY') || '';
    }
    get gcsBucketName() {
        return this.configService.get('GCS_BUCKET_NAME') || 'afridam-clinical-scans';
    }
    get flwSecretKey() {
        return this.configService.get('FLW_SECRET_KEY') || '';
    }
    get frontendUrl() {
        return this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    }
    get backendUrl() {
        return this.configService.get('BACKEND_URL') || `http://localhost:${this.port}`;
    }
    get port() {
        return this.configService.get('PORT') || 3000;
    }
    get nodeEnv() {
        return this.configService.get('NODE_ENV') || 'development';
    }
    get isProduction() {
        return this.nodeEnv === 'production' || process.env.NODE_ENV === 'production';
    }
    get isDevelopment() {
        return !this.isProduction;
    }
    throwMissingEnvError(envVar) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
};
exports.EnvironmentService = EnvironmentService;
exports.EnvironmentService = EnvironmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EnvironmentService);
//# sourceMappingURL=environment.service.js.map