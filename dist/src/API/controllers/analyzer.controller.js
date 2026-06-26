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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const analyzer_service_1 = require("../../domain/services/analyzer.service");
const create_analyzer_dto_1 = require("../../application/DTOs/analyzer/create-analyzer.dto");
const sub_user_guard_1 = require("../auth/guards/sub-user.guard");
let AnalyzerController = class AnalyzerController {
    constructor(analyzerService) {
        this.analyzerService = analyzerService;
    }
    async scan(file, moreInfo, req) {
        if (!file) {
            throw new common_1.BadRequestException('Image file is required for analysis');
        }
        if (!moreInfo) {
            throw new common_1.BadRequestException('The "more_info" field is required for skin analysis');
        }
        const userInfo = this.extractUserId(req.user);
        const analyzer = await this.analyzerService.scanAndSave(file, userInfo.id, moreInfo);
        return {
            succeeded: true,
            message: 'AI Analysis completed successfully',
            resultData: analyzer,
        };
    }
    async analyzeSkintone(file, req, moreInfo) {
        if (!file) {
            throw new common_1.BadRequestException('Image file is required for skintone analysis');
        }
        if (!moreInfo) {
            throw new common_1.BadRequestException('The "more_info" field is required for skintone analysis');
        }
        const userInfo = this.extractUserId(req.user);
        const result = await this.analyzerService.analyzeSkintoneAndSave(file, userInfo.id, moreInfo);
        return {
            succeeded: true,
            message: 'Skintone analysis complete',
            resultData: result
        };
    }
    async create(createAnalyzerDto, req) {
        const userInfo = this.extractUserId(req.user);
        const analyzer = await this.analyzerService.createAnalyzer({ ...createAnalyzerDto }, userInfo.id, userInfo.type);
        return {
            succeeded: true,
            message: 'Analyzer created successfully',
            resultData: analyzer,
        };
    }
    async checkHealth() {
        return this.analyzerService.checkHealth();
    }
    async getMyAnalyzer(req) {
        const userInfo = this.extractUserId(req.user);
        return this.analyzerService.getAnalyzerByUserId(userInfo.id, userInfo.type);
    }
    async getAllAnalyzers() {
        return this.analyzerService.getAllAnalyzers();
    }
    async getAnalyzer(id) {
        return this.analyzerService.getAnalyzerById(id);
    }
    async getAnalyzersbyUserId(id) {
        return this.analyzerService.getAnalyzersByUserId(id);
    }
    async updateAnalyzer(id, updateAnalyzerDto) {
        const analyzer = await this.analyzerService.updateAnalyzer(id, updateAnalyzerDto);
        return {
            succeeded: true,
            message: 'Analyzer updated successfully',
            resultData: analyzer,
        };
    }
    async deleteAnalyzer(id) {
        return this.analyzerService.deleteAnalyzer(id);
    }
    extractUserId(user) {
        if (!user)
            throw new common_1.BadRequestException('User authentication required');
        if (user.id)
            return { id: user.id, type: 'user' };
        if (user.user?.id)
            return { id: user.user.id, type: 'user' };
        if (user.sub)
            return { id: user.sub, type: 'user' };
        throw new common_1.BadRequestException('User ID could not be identified from token');
    }
};
exports.AnalyzerController = AnalyzerController;
__decorate([
    (0, common_1.Post)('skin-diagnosis'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload skin image for AI diagnosis',
        description: 'Upload an image and get a detailed AI analysis of skin conditions'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Skin image file (JPG, PNG)',
                },
                more_info: {
                    type: 'string',
                    description: 'Context for the analysis (Required JSON string)',
                }
            },
            required: ['file', 'more_info']
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('more_info')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "scan", null);
__decorate([
    (0, common_1.Post)('skintone-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload skin image for AI skintone analysis' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Skin image file (JPG, PNG)',
                },
                more_info: {
                    type: 'string',
                    description: 'Context for the skintone analysis',
                }
            },
            required: ['file', 'more_info']
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('more_info')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "analyzeSkintone", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new analyzer' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_analyzer_dto_1.CreateAnalyzerDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('health-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check AI Service Health' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "checkHealth", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get my analyzer' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "getMyAnalyzer", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all analyzers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "getAllAnalyzers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(sub_user_guard_1.SubUserGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get analyzer by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "getAnalyzer", null);
__decorate([
    (0, common_1.Get)('result/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analyzer by UseID' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "getAnalyzersbyUserId", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update analyzer by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "updateAnalyzer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete analyzer by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyzerController.prototype, "deleteAnalyzer", null);
exports.AnalyzerController = AnalyzerController = __decorate([
    (0, swagger_1.ApiTags)('AI'),
    (0, common_1.Controller)('v2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analyzer_service_1.AnalyzerService])
], AnalyzerController);
//# sourceMappingURL=analyzer.controller.js.map