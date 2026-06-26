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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./application/use-cases/app.service");
const smart_redirect_guard_1 = require("./API/auth/smart-redirect.guard");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Afridam Backend API',
            version: '1.0.0'
        };
    }
    getFeatures() {
        return {
            features: [
                {
                    name: 'Clinical Intelligence & Onboarding',
                    description: 'Fitzpatrick Scale Integration and medical profiling',
                    enabled: true
                },
                {
                    name: 'Revenue & Appointment Logic',
                    description: 'Choice-based access with specialty tiers',
                    pricing: {
                        instantSession: '$15 one-time',
                        starterPlan: '$3 for first month'
                    },
                    enabled: true
                },
                {
                    name: 'Security & Compliance',
                    description: 'Account deletion workflow and data privacy',
                    enabled: true
                },
                {
                    name: 'AI Scanner',
                    description: 'Clinical viewfinder with scanning animation',
                    enabled: true
                },
                {
                    name: 'Auth Recovery',
                    description: 'Forgot password functionality',
                    enabled: true
                }
            ]
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(smart_redirect_guard_1.SmartRedirectGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Landing page with smart redirect' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Welcome message or redirect to dashboard' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('v2/health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service health status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('features'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available features' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available features' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getFeatures", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('App'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map