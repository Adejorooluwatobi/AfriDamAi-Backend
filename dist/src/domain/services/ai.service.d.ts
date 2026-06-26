import { HttpService } from '@nestjs/axios';
import { ChatbotRequestDto, ChatbotResponseDto } from 'src/application/DTOs/ai/chatbot.dto';
import { IngredientsAnalysisRequestDto, IngredientsAnalysisResponseDto } from 'src/application/DTOs/ai/ingredients.dto';
import { EnvironmentService } from 'src/shared/services/environment.service';
import { ValidationService } from 'src/shared/services/validation.service';
import { RateLimitService } from 'src/shared/services/rate-limit.service';
import type { IUserRepository } from '../repositories/user.repository.interface';
import type { IProfileRepository } from '../repositories/profile.repository.interface';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
export declare class AiService {
    private readonly httpService;
    private readonly envService;
    private readonly validationService;
    private readonly rateLimitService;
    private readonly prisma;
    private readonly userRepository;
    private readonly profileRepository;
    private readonly chatbotEndpoint;
    private readonly ingredientsEndpoint;
    private readonly baseUrl;
    private readonly logger;
    private auth;
    constructor(httpService: HttpService, envService: EnvironmentService, validationService: ValidationService, rateLimitService: RateLimitService, prisma: PrismaService, userRepository: IUserRepository, profileRepository: IProfileRepository);
    private getEnrichedContext;
    private getAuthHeaders;
    callChatbot(request: ChatbotRequestDto, userId?: string): Promise<ChatbotResponseDto>;
    analyzeIngredients(request: IngredientsAnalysisRequestDto, userId?: string): Promise<IngredientsAnalysisResponseDto>;
    getChatHistory(userId: string): Promise<{
        query: string;
        id: string;
        createdAt: Date;
        userId: string;
        response: string;
        context: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}
