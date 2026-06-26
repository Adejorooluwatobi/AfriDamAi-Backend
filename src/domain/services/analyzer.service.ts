import { Injectable, Inject, InternalServerErrorException, Logger, BadRequestException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { GoogleAuth } from 'google-auth-library';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { AnalyzerEntity } from "../entities/analyzer.entity";
import { CreateAnalyzerParams, UpdateAnalyzerParams, UploadedFile } from "src/utils/type";
import type { IAnalyzerRepository } from "../repositories/analyzer.repository.interface";
import { ValidationService } from 'src/shared/services/validation.service';
import { RateLimitService } from 'src/shared/services/rate-limit.service';
import { EnvironmentService } from 'src/shared/services/environment.service';
import type { IUserRepository } from '../repositories/user.repository.interface';
import type { IProfileRepository } from '../repositories/profile.repository.interface';
import { AiMoreInfo } from "src/utils/type";
import { AiMapper } from "src/infrastructure/mappers/ai.mapper";
import { FileUploadService } from "src/shared/services/file-upload.service";

@Injectable()
export class AnalyzerService {
    private auth: GoogleAuth;
    private readonly baseUrl: string;
    private readonly diagnosisEndpoint = '/api/v2/skin-diagnosis';

    constructor(
        @Inject('IAnalyzerRepository') private readonly analyzerRepository: IAnalyzerRepository,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IProfileRepository') private readonly profileRepository: IProfileRepository,
        private readonly httpService: HttpService,
        private readonly validationService: ValidationService,
        private readonly rateLimitService: RateLimitService,
        private readonly envService: EnvironmentService,
        private readonly fileUploadService: FileUploadService,
    ) {
        this.baseUrl = this.envService.aiServiceUrl;
        const authConfig: any = {};
        const keyFile = this.envService.googleKeyFile;
        if (keyFile) {
            authConfig.keyFile = keyFile;
        }
        this.auth = new GoogleAuth(authConfig);
    }

    private readonly logger = new Logger(AnalyzerService.name);

    /**
     * Fetches user context to populate more_info using professional mapper
     * and merges with client-provided data.
     */
    private async getEnrichedContext(userId: string, existingMoreInfo: any = {}): Promise<AiMoreInfo> {
        const [user, profile] = await Promise.all([
            this.userRepository.findById(userId),
            this.profileRepository.findByUserId(userId, 'user'),
        ]);

        // Use professional mapper to get system context
        const context = AiMapper.toAiMoreInfo(user as any, profile as any);

        // Merge with existing more_info (client overrides system defaults)
        return { ...context, ...existingMoreInfo };
    }

    /**
     * ✅ UPDATED: file type is now UploadedFile to avoid Multer namespace errors
     */
    async scanAndSave(file: UploadedFile, userId: string, moreInfo: string): Promise<AnalyzerEntity> {
        this.logger.log(`Starting skin analysis for user: ${userId}`);
        
        let finalMoreInfoObj: any = {};
        try {
            if (!file || !file.buffer) {
                throw new BadRequestException('No image file provided');
            }

            if (!moreInfo) {
                throw new BadRequestException('The "more_info" field is required for skin analysis');
            }

            // 1. Get Authentication Token from Google  
            this.logger.debug('Fetching Google Identity Token...');
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            
            // Explicitly fetch the ID token (getRequestHeaders() was returning empty)
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            
            if (!idToken) {
                this.logger.error('Failed to get ID token from Google Auth');
                throw new InternalServerErrorException('Authentication failed: No ID token');
            }
            
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };
            
            this.logger.debug(`Auth token obtained successfully (length: ${idToken.length})`);
            const credentials = await this.auth.getCredentials();
            this.logger.log(`🔐 Using Service Account: ${credentials.client_email}`);
            this.logger.log(`🎯 Token Audience: ${this.baseUrl}`);

            // 2. Build Enriched Context (Database + Client Overrides + Sanitization)
            const clientMoreInfo = moreInfo ? JSON.parse(moreInfo) : {};
            finalMoreInfoObj = await this.getEnrichedContext(userId, clientMoreInfo);

            // Log final payload for debugging (Important!)
            this.logger.log(`Final more_info payload for skin diagnosis: ${JSON.stringify(finalMoreInfoObj)}`);

            // 3. Prepare the Image for the AI
            this.logger.debug(`File Details - Name: ${file.originalname}, Size: ${file.size}, Mime: ${file.mimetype}`);
            const formData = new FormData(); 
            
            // AI expects more_info as a string field in the multipart request
            formData.append('more_info', JSON.stringify(finalMoreInfoObj));

            formData.append('file', file.buffer, {
                filename: file.originalname.replace(/\s+/g, '_'),
                contentType: file.mimetype,
            });

            // 3. Call the AI API
            this.logger.debug(`Sending request to AI service: ${this.baseUrl}${this.diagnosisEndpoint}`);
            const aiResponse = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}${this.diagnosisEndpoint}`, formData as any, {
                    headers: {
                        ...tokenHeaders,
                        ...(formData.getHeaders() as any),
                    },
                    timeout: 240000, // 120s timeout for complex analysis
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                }),
            );

            if (!aiResponse.data) {
                this.logger.error('Empty response from AI service');
                throw new InternalServerErrorException('AI Service returned an invalid response');
            }

            this.logger.log('AI Analysis successful');
            const data = aiResponse.data;
            this.logger.debug(`AI Response Data: ${JSON.stringify(data)}`);

            // 4. Save Image locally and Compress
            const finalImageUrl = await this.fileUploadService.uploadImageFile(file);

            const scanResult: CreateAnalyzerParams = {
                userId: userId,
                status: data.status || 'success',
                imageUrl: finalImageUrl, 
                aiImageUrl: data.image || null,
                predictions: data.predictions || {},
                label: String(data.label || (data.shape && data.shape[0]) || 'Unknown'),
                description: data.description || 'No description provided',
            };

            // 5. Save to Database
            return await this.analyzerRepository.create(scanResult);

        } catch (error: any) {
            this.logger.error('AI Scan Error', error.stack);
            
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                
                if (status === 422) {
                    throw new BadRequestException({
                        message: 'AI Service validation failed during scan',
                        detail: errorDetail,
                        payload_sent: finalMoreInfoObj
                    });
                }
            }
            
            const errorData = error.response?.data;
            const errorMsg = errorData?.detail || errorData?.message || errorData || error.message;
            
            throw new InternalServerErrorException(`AI Diagnosis failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    }

    /**
     * Analyzes skintone from an image using AI service
     */
    async analyzeSkintoneAndSave(file: UploadedFile, userId: string, moreInfo: string): Promise<AnalyzerEntity> {
        this.logger.log(`Starting skintone analysis for user: ${userId}`);
        
        let finalMoreInfoObj: any = {};
        try {
            if (!file || !file.buffer) {
                throw new BadRequestException('No image file provided');
            }

            if (!moreInfo) {
                throw new BadRequestException('The "more_info" field is required for skintone analysis');
            }

            // 1. Get Authentication Token from Google
            this.logger.debug('Fetching Google Identity Token for skintone analysis...');
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            if (!idToken) {
                throw new Error('Failed to get ID token');
            }
            
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };

            // 2. Build Enriched Context
            const clientMoreInfo = moreInfo ? JSON.parse(moreInfo) : {};
            finalMoreInfoObj = await this.getEnrichedContext(userId, clientMoreInfo);

            // Log final payload for debugging
            this.logger.log(`Final more_info payload for skintone analysis: ${JSON.stringify(finalMoreInfoObj)}`);

            // 3. Prepare the Image for the AI
            this.logger.debug(`File Details - Name: ${file.originalname}, Size: ${file.size}, Mime: ${file.mimetype}`);
            const formData = new FormData(); 
            
            // AI expects more_info as a string field in the multipart request
            formData.append('more_info', JSON.stringify(finalMoreInfoObj));

            formData.append('file', file.buffer, {
                filename: file.originalname.replace(/\s+/g, '_'),
                contentType: file.mimetype,
            });

            // 4. Call the AI API for skintone analysis (use different endpoint if available)
            const skintoneEndpoint = '/api/v2/skintone-analysis'; // Adjust endpoint as needed
            this.logger.debug(`Sending request to AI service: ${this.baseUrl}${skintoneEndpoint}`);
            const aiResponse = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}${skintoneEndpoint}`, formData as any, {
                    headers: {
                        ...tokenHeaders,
                        ...(formData.getHeaders() as any),
                    },
                    timeout: 240000, // 240s timeout for complex analysis
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                }),
            );

            if (!aiResponse.data) {
                this.logger.error('Empty response from AI service');
                throw new InternalServerErrorException('AI Service returned an invalid response');
            }

            this.logger.log('AI Skintone Analysis successful');
            const data = aiResponse.data;
            this.logger.debug(`AI Response Data: ${JSON.stringify(data)}`);

            // 4. Save Image locally and Compress
            const savedImageUrl = await this.fileUploadService.uploadImageFile(file);
            // Remove leading slash if present to maintain consistency with 'uploads/' prefix
            const finalImageUrl = savedImageUrl.startsWith('/') ? savedImageUrl.substring(1) : savedImageUrl;

            const scanResult: CreateAnalyzerParams = {
                userId: userId,
                status: data.status || 'success',
                imageUrl: finalImageUrl, 
                aiImageUrl: data.image || null,
                predictions: data.predictions || {},
                label: String(data.label || (data.skintone_type && data.skintone_type[0]) || 'Unknown'),
                description: data.description || 'No description provided',
            };

            // 5. Save to Database
            return await this.analyzerRepository.create(scanResult);

        } catch (error: any) {
            this.logger.error('AI Skintone Analysis Error', error.stack);
            
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                
                if (status === 422) {
                    throw new BadRequestException({
                        message: 'AI Service validation failed during skintone analysis',
                        detail: errorDetail,
                        payload_sent: finalMoreInfoObj
                    });
                }
            }
            
            const errorData = error.response?.data;
            const errorMsg = errorData?.detail || errorData?.message || errorData || error.message;
            
            throw new InternalServerErrorException(`AI Skintone Analysis failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    }
    

    async createAnalyzer(analyzerDetails: CreateAnalyzerParams, userId: string, userType: string): Promise<AnalyzerEntity> {
        const { userId: _, ...analyzerData } = analyzerDetails;
        const analyzerCreateData: any = { ...analyzerData };
        
        if (userType === 'user') analyzerCreateData.userId = userId;
        
        const analyzer = await this.analyzerRepository.create(analyzerCreateData);
        return analyzer;
    }

    async getAnalyzerByUserId(userId: string, userType: string): Promise<AnalyzerEntity | null> {
        return this.analyzerRepository.findByUserId(userId, userType);
    }

    async getAllAnalyzers(): Promise<AnalyzerEntity[]> {
        return this.analyzerRepository.findAll();
    }

    async getAnalyzerById(id: string): Promise<AnalyzerEntity | null> {
        return this.analyzerRepository.findById(id);
    }

    async getAnalyzersByUserId(userId: string): Promise<AnalyzerEntity[]> {
        return this.analyzerRepository.findAllByUserId(userId);
    }

    async updateAnalyzer(id: string, updateData: Partial<UpdateAnalyzerParams>): Promise<AnalyzerEntity> {
        return this.analyzerRepository.update(id, updateData);
    }

    async checkHealth(): Promise<any> {
        this.logger.debug('Checking AI Service Health...');
        try {
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            
            // Explicitly fetch the ID token (same fix as scanAndSave)
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            
            if (!idToken) {
                throw new Error('Failed to get ID token for health check');
            }
            
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };

            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/api/v2/health`, {
                    headers: tokenHeaders,
                }),
            );
            return response.data;
        } catch (error) {
            this.logger.error('AI Health Check Failed', error.stack);
            throw new InternalServerErrorException('Failed to connect to AI Service');
        }
    }

    async processAiRequest(query: string, flag: 'chat' | 'ingredient_analysis', userId: string, extraMoreInfo: string = ''): Promise<any> {
        this.logger.debug(`Processing AI Request: ${flag} for user: ${userId}`);
        let payload: any = {};
        try {
            // 1. Get User and Profile Data
            const [user, profile] = await Promise.all([
                this.userRepository.findById(userId),
                this.profileRepository.findByUserId(userId, 'user'),
            ]);

            // 2. Build Enriched Context (System Data + Sanitization)
            const moreInfo = await this.getEnrichedContext(userId, extraMoreInfo ? { extra: extraMoreInfo } : {});

            // 3. Prepare Payload
            payload = {
                query: query,
                more_info: moreInfo,
            };

            this.logger.log(`Full outgoing payload to AI service [${flag}]: ${JSON.stringify(payload)}`);

            // 4. Authenticate with Google
            const client = await this.auth.getIdTokenClient(this.baseUrl);
            
            const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
            if (!idToken) {
                throw new Error('Failed to get ID token');
            }
            
            const tokenHeaders = {
                'Authorization': `Bearer ${idToken}`
            };

            // 5. Determine Endpoint
            const endpoint = flag === 'chat' ? '/api/v2/chatbot' : '/api/v2/ingredients-analysis';

            // 6. Call the AI API
            const response = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}${endpoint}`, payload, {
                    headers: {
                        ...(tokenHeaders as any),
                        'Content-Type': 'application/json',
                    },
                }),
            );

            return response.data;
        } catch (error: any) {
            this.logger.error(`AI ${flag} request failed`, error.stack);
            
            if (error.response?.data) {
                const errorDetail = error.response.data.detail;
                const status = error.response.status;
                this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
                
                if (status === 422) {
                    throw new BadRequestException({
                        message: `AI Service validation failed during ${flag}`,
                        detail: errorDetail,
                        payload_sent: payload
                    });
                }
            }
            
            const errorData = error.response?.data;
            const errorMsg = errorData?.detail || errorData || error.message;
            
            throw new InternalServerErrorException(`AI Request failed: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`);
        }
    }

    async deleteAnalyzer(id: string): Promise<void> {
        return this.analyzerRepository.delete(id);
    }

    // async startScanning(userId: string): Promise<AnalyzerEntity> {
    //     this.logger.log(`Starting scanning session for user: ${userId}`);

    //     const scanData: CreateAnalyzerParams = {
    //         userId: userId,
    //         status: 'scanning',
    //         imageUrl: '',
    //         predictions: {},
    //         description: 'Scanning in progress...',
    //         scanningStatus: 'initializing'
    //     };

    //     return await this.analyzerRepository.create(scanData);
    // }

    // async updateScanningStatus(analyzerId: string, status: 'initializing' | 'capturing' | 'processing' | 'completed' | 'failed', progress?: number): Promise<AnalyzerEntity> {
    //     this.logger.log(`Updating scanning status for analyzer ${analyzerId}: ${status}`);

    //     const updateData: Partial<UpdateAnalyzerParams> = {
    //         scanningStatus: status,
    //         status: status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'scanning'
    //     };

    //     if (progress !== undefined) {
    //         updateData.scanningProgress = progress;
    //     }

    //     return await this.analyzerRepository.update(analyzerId, updateData);
    // }

    // async completeScanning(analyzerId: string, imageUrl: string, predictions: Record<string, number>, description: string): Promise<AnalyzerEntity> {
    //     this.logger.log(`Completing scanning for analyzer ${analyzerId}`);

    //     return await this.analyzerRepository.update(analyzerId, {
    //         status: 'success',
    //         scanningStatus: 'completed',
    //         scanningProgress: 100,
    //         imageUrl,
    //         predictions,
    //         description
    //     });
    // }
}
