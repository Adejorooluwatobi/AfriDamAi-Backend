import { Injectable, Inject, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GoogleAuth } from 'google-auth-library';
import { ChatbotRequestDto, ChatbotResponseDto } from 'src/application/DTOs/ai/chatbot.dto';
import { IngredientsAnalysisRequestDto, IngredientsAnalysisResponseDto } from 'src/application/DTOs/ai/ingredients.dto';
import { EnvironmentService } from 'src/shared/services/environment.service';
import { ValidationService } from 'src/shared/services/validation.service';
import { RateLimitService } from 'src/shared/services/rate-limit.service';
import type { IUserRepository } from '../repositories/user.repository.interface';
import type { IProfileRepository } from '../repositories/profile.repository.interface';
import { AiMoreInfo } from 'src/utils/type';
import { AiMapper } from 'src/infrastructure/mappers/ai.mapper';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly chatbotEndpoint = '/api/v2/chatbot';
  private readonly ingredientsEndpoint = '/api/v2/ingredients-analysis';
  private readonly baseUrl: string;
  private readonly logger = new Logger(AiService.name);
  private auth: GoogleAuth;

  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvironmentService,
    private readonly validationService: ValidationService,
    private readonly rateLimitService: RateLimitService,
    private readonly prisma: PrismaService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IProfileRepository') private readonly profileRepository: IProfileRepository,
  ) {
    this.baseUrl = this.envService.aiServiceUrl;
    if (!this.baseUrl) {
      this.logger.warn('AI_SERVICE_URL not configured. AI features may not work.');
    }
    const authConfig: any = {};
    const keyFile = this.envService.googleKeyFile;
    if (keyFile) {
        authConfig.keyFile = keyFile;
    }
    this.auth = new GoogleAuth(authConfig);
  }

  /**
   * Fetches user context to populate more_info using professional mapper
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
   * Gets Google Identity Token for AI service
   */
  private async getAuthHeaders(): Promise<any> {
    const client = await this.auth.getIdTokenClient(this.baseUrl);
    
    const idToken = await client.idTokenProvider.fetchIdToken(this.baseUrl);
    if (!idToken) {
      throw new Error('Failed to get ID token for AI service');
    }
    
    return {
      'Authorization': `Bearer ${idToken}`
    };
  }

  /**
   * Call the chatbot AI endpoint to generate skincare advice
   */
  async callChatbot(request: ChatbotRequestDto, userId?: string): Promise<ChatbotResponseDto> {
    this.logger.log(`Calling chatbot with query: ${request.query}`);

    let payload: any;
    try {
      if (!request.query || request.query.trim().length === 0) {
        throw new BadRequestException('Query cannot be empty');
      }

      // Populate enriched context if userId is available
      const moreInfo = userId 
        ? await this.getEnrichedContext(userId, request.more_info)
        : (request.more_info || {});

      payload = {
        query: request.query,
        more_info: moreInfo,
      };

      this.logger.log(`Full outgoing payload to AI service [chatbot]: ${JSON.stringify(payload)}`);
      
      const tokenHeaders = await this.getAuthHeaders();

      const response = await firstValueFrom(
        this.httpService.post<ChatbotResponseDto>(
          `${this.baseUrl}${this.chatbotEndpoint}`,
          payload,
          {
            timeout: 120000,
            headers: {
              ...tokenHeaders,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      if (!response.data || !response.data.response) {
        this.logger.error('Invalid response from chatbot API');
        throw new InternalServerErrorException('Invalid response from AI service');
      }

      // 🚀 CEO LOGIC: Persist interaction for history
      if (userId) {
        await this.prisma.aIChat.create({
          data: {
            userId,
            query: request.query,
            response: response.data.response,
            context: moreInfo as any,
          }
        });
        this.logger.log(`Chat interaction stored for user: ${userId}`);
      }

      this.logger.log('Chatbot call successful');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorDetail = error.response.data.detail;
        const status = error.response.status;
        
        this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
        
        if (status === 422) {
          throw new BadRequestException({
            message: 'AI Service validation failed',
            detail: errorDetail,
            payload_sent: payload
          });
        }
        
        throw new InternalServerErrorException(
          typeof errorDetail === 'string' ? errorDetail : 'AI service error'
        );
      }
      
      this.logger.error(`Chatbot error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Call the ingredients analyzer AI endpoint
   */
  async analyzeIngredients(request: IngredientsAnalysisRequestDto, userId?: string): Promise<IngredientsAnalysisResponseDto> {
    this.logger.log(`Analyzing ingredients: ${request.query}`);

    let payload: any;
    try {
      if (!request.query || request.query.trim().length === 0) {
        throw new BadRequestException('Ingredient list cannot be empty');
      }

      // Populate enriched context if userId is available
      const moreInfo = userId 
        ? await this.getEnrichedContext(userId, request.more_info)
        : (request.more_info || {});

      payload = {
        query: request.query,
        more_info: moreInfo,
      };

      this.logger.log(`Full outgoing payload to AI service [ingredients]: ${JSON.stringify(payload)}`);
      
      const tokenHeaders = await this.getAuthHeaders();

      const response = await firstValueFrom(
        this.httpService.post<IngredientsAnalysisResponseDto>(
          `${this.baseUrl}${this.ingredientsEndpoint}`,
          payload,
          {
            timeout: 120000,
            headers: {
              ...tokenHeaders,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      if (!response.data || !response.data.response) {
        this.logger.error('Invalid response from ingredients analyzer API');
        throw new InternalServerErrorException('Invalid response from AI service');
      }

      // 🚀 CEO LOGIC: Persist interaction for history
      if (userId) {
        await this.prisma.aIChat.create({
          data: {
            userId,
            query: `Analyze Ingredients: ${request.query.substring(0, 500)}...`,
            response: response.data.response,
            context: moreInfo as any,
          }
        });
        this.logger.log(`Ingredients analysis stored for user: ${userId}`);
      }

      this.logger.log('Ingredients analysis successful');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorDetail = error.response.data.detail;
        const status = error.response.status;
        
        this.logger.error(`AI service error [${status}]: ${JSON.stringify(errorDetail || error.response.data)}`);
        
        if (status === 422) {
          throw new BadRequestException({
            message: 'AI Service validation failed',
            detail: errorDetail,
            payload_sent: payload
          });
        }
        
        throw new InternalServerErrorException(
          typeof errorDetail === 'string' ? errorDetail : 'AI service error'
        );
      }

      this.logger.error(`Ingredients analyzer error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 🚀 CEO LOGIC: Get User AI Chat History
   */
  async getChatHistory(userId: string) {
    this.logger.log(`Fetching AI chat history for user: ${userId}`);
    return this.prisma.aIChat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
