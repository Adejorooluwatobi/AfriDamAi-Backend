import { AiService } from 'src/domain/services/ai.service';
import { ChatbotRequestDto, ChatbotResponseDto } from 'src/application/DTOs/ai/chatbot.dto';
import { IngredientsAnalysisRequestDto, IngredientsAnalysisResponseDto } from 'src/application/DTOs/ai/ingredients.dto';
export declare class AiController {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AiService);
    getHistory(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: {
            query: string;
            id: string;
            createdAt: Date;
            userId: string;
            response: string;
            context: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    chatbot(chatbotRequest: ChatbotRequestDto, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: ChatbotResponseDto;
    }>;
    analyzeIngredients(ingredientsRequest: IngredientsAnalysisRequestDto, req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: IngredientsAnalysisResponseDto;
    }>;
}
