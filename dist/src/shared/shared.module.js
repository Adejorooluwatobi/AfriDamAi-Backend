"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const environment_service_1 = require("./services/environment.service");
const validation_service_1 = require("./services/validation.service");
const rate_limit_service_1 = require("./services/rate-limit.service");
const jwt_1 = require("@nestjs/jwt");
const app_gateway_1 = require("./websockets/app.gateway");
const file_upload_service_1 = require("./services/file-upload.service");
const google_meet_service_1 = require("../domain/services/google-meet.service");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production',
                    signOptions: { expiresIn: '60s' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            environment_service_1.EnvironmentService,
            validation_service_1.ValidationService,
            rate_limit_service_1.RateLimitService,
            app_gateway_1.AppGateway,
            file_upload_service_1.FileUploadService,
            google_meet_service_1.GoogleMeetService,
        ],
        exports: [
            environment_service_1.EnvironmentService,
            validation_service_1.ValidationService,
            rate_limit_service_1.RateLimitService,
            app_gateway_1.AppGateway,
            file_upload_service_1.FileUploadService,
            google_meet_service_1.GoogleMeetService,
        ],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map