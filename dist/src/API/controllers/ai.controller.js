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
var AiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const ai_service_1 = require("../../domain/services/ai.service");
const chatbot_dto_1 = require("../../application/DTOs/ai/chatbot.dto");
const ingredients_dto_1 = require("../../application/DTOs/ai/ingredients.dto");
let AiController = AiController_1 = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(AiController_1.name);
    }
    async getHistory(req) {
        const history = await this.aiService.getChatHistory(req.user.id);
        return {
            succeeded: true,
            message: 'AI chat history retrieved successfully',
            resultData: history,
        };
    }
    async chatbot(chatbotRequest, req) {
        this.logger.log(`Chatbot request from user: ${req.user?.id}`);
        const response = await this.aiService.callChatbot(chatbotRequest, req.user?.id);
        return {
            succeeded: true,
            message: 'Chatbot response generated successfully',
            resultData: response,
        };
    }
    async analyzeIngredients(ingredientsRequest, req) {
        this.logger.log(`Ingredients analysis request from user: ${req.user?.id}`);
        const response = await this.aiService.analyzeIngredients(ingredientsRequest, req.user?.id);
        return {
            succeeded: true,
            message: 'Ingredients analysis completed successfully',
            resultData: response,
        };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('ai-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user AI interaction history',
        description: 'Retrieve all previous interactions between the user and the AI analyzer/chatbot'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of AI interactions' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('chatbot'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get skincare advice from AI chatbot',
        description: 'Interact with the Afridamatologist AI to get skincare advice and recommendations based on user context'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful response from chatbot',
        type: chatbot_dto_1.ChatbotResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chatbot_dto_1.ChatbotRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chatbot", null);
__decorate([
    (0, common_1.Post)('ingredients-analysis'),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze skincare product ingredients',
        description: 'Get detailed analysis of product ingredients with personalized recommendations based on user profile'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful ingredients analysis',
        type: ingredients_dto_1.IngredientsAnalysisResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingredients_dto_1.IngredientsAnalysisRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "analyzeIngredients", null);
exports.AiController = AiController = AiController_1 = __decorate([
    (0, swagger_1.ApiTags)('AI Services'),
    (0, common_1.Controller)('v2'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map