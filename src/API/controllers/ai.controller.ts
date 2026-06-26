import { Body, Controller, Post, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from 'src/domain/services/ai.service';
import { ChatbotRequestDto, ChatbotResponseDto } from 'src/application/DTOs/ai/chatbot.dto';
import { IngredientsAnalysisRequestDto, IngredientsAnalysisResponseDto } from 'src/application/DTOs/ai/ingredients.dto';

@ApiTags('AI Services')
@Controller('v2')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Get('ai-history')
  @ApiOperation({ 
    summary: 'Get user AI interaction history',
    description: 'Retrieve all previous interactions between the user and the AI analyzer/chatbot'
  })
  @ApiResponse({ status: 200, description: 'List of AI interactions' })
  async getHistory(@Request() req: any) {
    const history = await this.aiService.getChatHistory(req.user.id);
    return {
      succeeded: true,
      message: 'AI chat history retrieved successfully',
      resultData: history,
    };
  }

  @Post('chatbot')
  @ApiOperation({ 
    summary: 'Get skincare advice from AI chatbot',
    description: 'Interact with the Afridamatologist AI to get skincare advice and recommendations based on user context'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful response from chatbot',
    type: ChatbotResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async chatbot(
    @Body() chatbotRequest: ChatbotRequestDto,
    @Request() req: any,
  ) {
    this.logger.log(`Chatbot request from user: ${req.user?.id}`);
    
    const response = await this.aiService.callChatbot(chatbotRequest, req.user?.id);
    
    return {
      succeeded: true,
      message: 'Chatbot response generated successfully',
      resultData: response,
    };
  }

  @Post('ingredients-analysis')
  @ApiOperation({ 
    summary: 'Analyze skincare product ingredients',
    description: 'Get detailed analysis of product ingredients with personalized recommendations based on user profile'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successful ingredients analysis',
    type: IngredientsAnalysisResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Validation error' })
  async analyzeIngredients(
    @Body() ingredientsRequest: IngredientsAnalysisRequestDto,
    @Request() req: any,
  ) {
    this.logger.log(`Ingredients analysis request from user: ${req.user?.id}`);
    
    const response = await this.aiService.analyzeIngredients(ingredientsRequest, req.user?.id);
    
    return {
      succeeded: true,
      message: 'Ingredients analysis completed successfully',
      resultData: response,
    };
  }
}
