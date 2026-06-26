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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const google_auth_library_1 = require("google-auth-library");
const environment_service_1 = require("../../shared/services/environment.service");
const validation_service_1 = require("../../shared/services/validation.service");
const rate_limit_service_1 = require("../../shared/services/rate-limit.service");
const ai_mapper_1 = require("../../infrastructure/mappers/ai.mapper");
const prisma_service_1 = require("../../infrastructure/persistence/prisma/prisma.service");
let AiService = AiService_1 = class AiService {
    constructor(httpService, envService, validationService, rateLimitService, prisma, userRepository, profileRepository) {
        this.httpService = httpService;
        this.envService = envService;
        this.validationService = validationService;
        this.rateLimitService = rateLimitService;
        this.prisma = prisma;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.chatbotEndpoint = '/api/v2/chatbot';
        this.ingredientsEndpoint = '/api/v2/ingredients-analysis';
        this.logger = new common_1.Logger(AiService_1.name);
        this.baseUrl = this.envService.aiServiceUrl;
        if (!this.baseUrl) {
            this.logger.warn('AI_SERVICE_URL not configured. AI features may not work.');
        }
        const authConfig = {};
        const keyFile = this.envService.googleKeyFile;
        if (keyFile) {
            authConfig.keyFile = keyFile;
        }
        this.auth = new google_auth_library_1.GoogleAuth(authConfig);
    }
    async getEnrichedContext(userId, existingMoreInfo = {}) {
        const [user, profile] = await Promise.all([
            this.userRepository.findById(userId),
            this.profileRepository.findByUserId(userId, 'user'),
        ]);
        const context = ai_mapper_1.AiMapper.toAiMoreInfo(user, profile);
        return { ...context, ...existingMoreInfo };
    }
    async getAuthHeaders() {
        const client = await this.auth.getIdTokenClient(this.baseUrl);
        const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
        if (!idToken) {
            throw new Error('Failed to get ID token for AI service');
        }
        return {
            'Authorization': `Bearer ${idToken}`
        };
    }
    async callChatbot(request, userId) {
        this.logger.log(`Calling chatbot with query: ${request.query}`);
        let payload;
        try {
            if (!request.query || request.query.trim().length === 0) {
                throw new common_1.BadRequestException('Query cannot be empty');
            }
            const moreInfo = userId
                ? await this.getEnrichedContext(userId, request.more_info)
                : (request.more_info || {});
            payload = {
                query: request.query,
                more_info: moreInfo,
            };
            this.logger.log(`Full outgoing payload to AI service [chatbot]: ${JSON.stringify(payload)}`);
            const tokenHeaders = await this.getAuthHeaders();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}${this.chatbotEndpoint}`, payload, {
                timeout: 120000,
                headers: {
                    ...tokenHeaders,
                    'Content-Type': 'application/json',
                },
            }));
            if (!response.data || !response.data.response) {
                this.logger.error('Invalid response from chatbot API');
                throw new common_1.InternalServerErrorException('Invalid response from AI service');
            }
            if (userId) {
                await this.prisma.aIChat.create({
                    data: {
                        userId,
                        query: request.query,
                        response: response.data.response,
                        context: moreInfo,
                    }
                });
                this.logger.log(`Chat interaction stored for user: ${userId}`);
            }
            this.logger.log('Chatbot call successful');
            return response.data;
        }
        catch (error) {
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                if (status === 422) {
                    throw new common_1.BadRequestException({
                        message: 'AI Service validation failed',
                        detail: errorDetail,
                        payload_sent: payload
                    });
                }
                throw new common_1.InternalServerErrorException(typeof errorDetail === 'string' ? errorDetail : 'AI service error');
            }
            this.logger.error(`Chatbot error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async analyzeIngredients(request, userId) {
        this.logger.log(`Analyzing ingredients: ${request.query}`);
        let payload;
        try {
            if (!request.query || request.query.trim().length === 0) {
                throw new common_1.BadRequestException('Ingredient list cannot be empty');
            }
            const moreInfo = userId
                ? await this.getEnrichedContext(userId, request.more_info)
                : (request.more_info || {});
            payload = {
                query: request.query,
                more_info: moreInfo,
            };
            this.logger.log(`Full outgoing payload to AI service [ingredients]: ${JSON.stringify(payload)}`);
            const tokenHeaders = await this.getAuthHeaders();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}${this.ingredientsEndpoint}`, payload, {
                timeout: 120000,
                headers: {
                    ...tokenHeaders,
                    'Content-Type': 'application/json',
                },
            }));
            if (!response.data || !response.data.response) {
                this.logger.error('Invalid response from ingredients analyzer API');
                throw new common_1.InternalServerErrorException('Invalid response from AI service');
            }
            if (userId) {
                await this.prisma.aIChat.create({
                    data: {
                        userId,
                        query: `Analyze Ingredients: ${request.query.substring(0, 500)}...`,
                        response: response.data.response,
                        context: moreInfo,
                    }
                });
                this.logger.log(`Ingredients analysis stored for user: ${userId}`);
            }
            this.logger.log('Ingredients analysis successful');
            return response.data;
        }
        catch (error) {
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                if (status === 422) {
                    throw new common_1.BadRequestException({
                        message: 'AI Service validation failed',
                        detail: errorDetail,
                        payload_sent: payload
                    });
                }
                throw new common_1.InternalServerErrorException(typeof errorDetail === 'string' ? errorDetail : 'AI service error');
            }
            this.logger.error(`Ingredients analyzer error: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getChatHistory(userId) {
        this.logger.log(`Fetching AI chat history for user: ${userId}`);
        return this.prisma.aIChat.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)('IUserRepository')),
    __param(6, (0, common_1.Inject)('IProfileRepository')),
    __metadata("design:paramtypes", [axios_1.HttpService,
        environment_service_1.EnvironmentService,
        validation_service_1.ValidationService,
        rate_limit_service_1.RateLimitService,
        prisma_service_1.PrismaService, Object, Object])
], AiService);
//# sourceMappingURL=ai.service.js.map