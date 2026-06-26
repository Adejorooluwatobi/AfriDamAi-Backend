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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AnalyzerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const google_auth_library_1 = require("google-auth-library");
const form_data_1 = __importDefault(require("form-data"));
const rxjs_1 = require("rxjs");
const validation_service_1 = require("../../shared/services/validation.service");
const rate_limit_service_1 = require("../../shared/services/rate-limit.service");
const environment_service_1 = require("../../shared/services/environment.service");
const ai_mapper_1 = require("../../infrastructure/mappers/ai.mapper");
const file_upload_service_1 = require("../../shared/services/file-upload.service");
let AnalyzerService = AnalyzerService_1 = class AnalyzerService {
    constructor(analyzerRepository, userRepository, profileRepository, httpService, validationService, rateLimitService, envService, fileUploadService) {
        this.analyzerRepository = analyzerRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.httpService = httpService;
        this.validationService = validationService;
        this.rateLimitService = rateLimitService;
        this.envService = envService;
        this.fileUploadService = fileUploadService;
        this.diagnosisEndpoint = '/api/v2/skin-diagnosis';
        this.logger = new common_1.Logger(AnalyzerService_1.name);
        this.baseUrl = this.envService.aiServiceUrl;
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
    async scanAndSave(file, userId, moreInfo) {
        this.logger.log(`Starting skin analysis for user: ${userId}`);
        let finalMoreInfoObj = {};
        try {
            if (!file || !file.buffer) {
                throw new common_1.BadRequestException('No image file provided');
            }
            if (!moreInfo) {
                throw new common_1.BadRequestException('The "more_info" field is required for skin analysis');
            }
            this.logger.debug('Fetching Google Identity Token...');
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            if (!idToken) {
                this.logger.error('Failed to get ID token from Google Auth');
                throw new common_1.InternalServerErrorException('Authentication failed: No ID token');
            }
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };
            this.logger.debug(`Auth token obtained successfully (length: ${idToken.length})`);
            const credentials = await this.auth.getCredentials();
            this.logger.log(`🔐 Using Service Account: ${credentials.client_email}`);
            this.logger.log(`🎯 Token Audience: ${this.baseUrl}`);
            const clientMoreInfo = moreInfo ? JSON.parse(moreInfo) : {};
            finalMoreInfoObj = await this.getEnrichedContext(userId, clientMoreInfo);
            this.logger.log(`Final more_info payload for skin diagnosis: ${JSON.stringify(finalMoreInfoObj)}`);
            this.logger.debug(`File Details - Name: ${file.originalname}, Size: ${file.size}, Mime: ${file.mimetype}`);
            const formData = new form_data_1.default();
            formData.append('more_info', JSON.stringify(finalMoreInfoObj));
            formData.append('file', file.buffer, {
                filename: file.originalname.replace(/\s+/g, '_'),
                contentType: file.mimetype,
            });
            this.logger.debug(`Sending request to AI service: ${this.baseUrl}${this.diagnosisEndpoint}`);
            const aiResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}${this.diagnosisEndpoint}`, formData, {
                headers: {
                    ...tokenHeaders,
                    ...formData.getHeaders(),
                },
                timeout: 240000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }));
            if (!aiResponse.data) {
                this.logger.error('Empty response from AI service');
                throw new common_1.InternalServerErrorException('AI Service returned an invalid response');
            }
            this.logger.log('AI Analysis successful');
            const data = aiResponse.data;
            this.logger.debug(`AI Response Data: ${JSON.stringify(data)}`);
            const finalImageUrl = await this.fileUploadService.uploadImageFile(file);
            const scanResult = {
                userId: userId,
                status: data.status || 'success',
                imageUrl: finalImageUrl,
                aiImageUrl: data.image || null,
                predictions: data.predictions || {},
                label: String(data.label || (data.shape && data.shape[0]) || 'Unknown'),
                description: data.description || 'No description provided',
            };
            return await this.analyzerRepository.create(scanResult);
        }
        catch (error) {
            this.logger.error('AI Scan Error', error.stack);
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                if (status === 422) {
                    throw new common_1.BadRequestException({
                        message: 'AI Service validation failed during scan',
                        detail: errorDetail,
                        payload_sent: finalMoreInfoObj
                    });
                }
            }
            const errorData = error.response?.data;
            const errorMsg = errorData?.detail || errorData?.message || errorData || error.message;
            throw new common_1.InternalServerErrorException(`AI Diagnosis failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    }
    async analyzeSkintoneAndSave(file, userId, moreInfo) {
        this.logger.log(`Starting skintone analysis for user: ${userId}`);
        let finalMoreInfoObj = {};
        try {
            if (!file || !file.buffer) {
                throw new common_1.BadRequestException('No image file provided');
            }
            if (!moreInfo) {
                throw new common_1.BadRequestException('The "more_info" field is required for skintone analysis');
            }
            this.logger.debug('Fetching Google Identity Token for skintone analysis...');
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            if (!idToken) {
                throw new Error('Failed to get ID token');
            }
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };
            const clientMoreInfo = moreInfo ? JSON.parse(moreInfo) : {};
            finalMoreInfoObj = await this.getEnrichedContext(userId, clientMoreInfo);
            this.logger.log(`Final more_info payload for skintone analysis: ${JSON.stringify(finalMoreInfoObj)}`);
            this.logger.debug(`File Details - Name: ${file.originalname}, Size: ${file.size}, Mime: ${file.mimetype}`);
            const formData = new form_data_1.default();
            formData.append('more_info', JSON.stringify(finalMoreInfoObj));
            formData.append('file', file.buffer, {
                filename: file.originalname.replace(/\s+/g, '_'),
                contentType: file.mimetype,
            });
            const skintoneEndpoint = '/api/v2/skintone-analysis';
            this.logger.debug(`Sending request to AI service: ${this.baseUrl}${skintoneEndpoint}`);
            const aiResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}${skintoneEndpoint}`, formData, {
                headers: {
                    ...tokenHeaders,
                    ...formData.getHeaders(),
                },
                timeout: 240000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }));
            if (!aiResponse.data) {
                this.logger.error('Empty response from AI service');
                throw new common_1.InternalServerErrorException('AI Service returned an invalid response');
            }
            this.logger.log('AI Skintone Analysis successful');
            const data = aiResponse.data;
            this.logger.debug(`AI Response Data: ${JSON.stringify(data)}`);
            const savedImageUrl = await this.fileUploadService.uploadImageFile(file);
            const finalImageUrl = savedImageUrl.startsWith('/') ? savedImageUrl.substring(1) : savedImageUrl;
            const scanResult = {
                userId: userId,
                status: data.status || 'success',
                imageUrl: finalImageUrl,
                aiImageUrl: data.image || null,
                predictions: data.predictions || {},
                label: String(data.label || (data.skintone_type && data.skintone_type[0]) || 'Unknown'),
                description: data.description || 'No description provided',
            };
            return await this.analyzerRepository.create(scanResult);
        }
        catch (error) {
            this.logger.error('AI Skintone Analysis Error', error.stack);
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                if (status === 422) {
                    throw new common_1.BadRequestException({
                        message: 'AI Service validation failed during skintone analysis',
                        detail: errorDetail,
                        payload_sent: finalMoreInfoObj
                    });
                }
            }
            const errorData = error.response?.data;
            const errorMsg = errorData?.detail || errorData?.message || errorData || error.message;
            throw new common_1.InternalServerErrorException(`AI Skintone Analysis failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    }
    async createAnalyzer(analyzerDetails, userId, userType) {
        const { userId: _, ...analyzerData } = analyzerDetails;
        const analyzerCreateData = { ...analyzerData };
        if (userType === 'user')
            analyzerCreateData.userId = userId;
        const analyzer = await this.analyzerRepository.create(analyzerCreateData);
        return analyzer;
    }
    async getAnalyzerByUserId(userId, userType) {
        return this.analyzerRepository.findByUserId(userId, userType);
    }
    async getAllAnalyzers() {
        return this.analyzerRepository.findAll();
    }
    async getAnalyzerById(id) {
        return this.analyzerRepository.findById(id);
    }
    async getAnalyzersByUserId(userId) {
        return this.analyzerRepository.findAllByUserId(userId);
    }
    async updateAnalyzer(id, updateData) {
        return this.analyzerRepository.update(id, updateData);
    }
    async checkHealth() {
        this.logger.debug('Checking AI Service Health...');
        try {
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            if (!idToken) {
                throw new Error('Failed to get ID token for health check');
            }
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/api/v2/health`, {
                headers: tokenHeaders,
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error('AI Health Check Failed', error.stack);
            throw new common_1.InternalServerErrorException('Failed to connect to AI Service');
        }
    }
    async processAiRequest(query, flag, userId, extraMoreInfo = '') {
        this.logger.debug(`Processing AI Request: ${flag} for user: ${userId}`);
        let payload = {};
        try {
            const [user, profile] = await Promise.all([
                this.userRepository.findById(userId),
                this.profileRepository.findByUserId(userId, 'user'),
            ]);
            const moreInfo = await this.getEnrichedContext(userId, extraMoreInfo ? { extra: extraMoreInfo } : {});
            payload = {
                query: query,
                more_info: moreInfo,
            };
            this.logger.log(`Full outgoing payload to AI service [${flag}]: ${JSON.stringify(payload)}`);
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            if (!idToken) {
                throw new Error('Failed to get ID token');
            }
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };
            const endpoint = flag === 'chat' ? '/api/v2/chatbot' : '/api/v2/ingredients-analysis';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}${endpoint}`, payload, {
                headers: {
                    ...tokenHeaders,
                    'Content-Type': 'application/json',
                },
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`AI ${flag} request failed`, error.stack);
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                if (status === 422) {
                    throw new common_1.BadRequestException({
                        message: `AI Service validation failed during ${flag}`,
                        detail: errorDetail,
                        payload_sent: payload
                    });
                }
            }
            const errorData = error.response?.data;
            const errorMsg = errorData?.detail || errorData || error.message;
            throw new common_1.InternalServerErrorException(`AI Request failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    }
    async deleteAnalyzer(id) {
        return this.analyzerRepository.delete(id);
    }
};
exports.AnalyzerService = AnalyzerService;
exports.AnalyzerService = AnalyzerService = AnalyzerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAnalyzerRepository')),
    __param(1, (0, common_1.Inject)('IUserRepository')),
    __param(2, (0, common_1.Inject)('IProfileRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, axios_1.HttpService,
        validation_service_1.ValidationService,
        rate_limit_service_1.RateLimitService,
        environment_service_1.EnvironmentService,
        file_upload_service_1.FileUploadService])
], AnalyzerService);
//# sourceMappingURL=analyzer.service.js.map