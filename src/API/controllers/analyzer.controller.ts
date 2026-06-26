import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyzerService } from 'src/domain/services/analyzer.service';
import { CreateAnalyzerDto } from 'src/application/DTOs/analyzer/create-analyzer.dto';
import { UpdateAnalyzerDto } from 'src/application/DTOs/analyzer/update-analyzer.dto';
import { SubUserGuard } from '../auth/guards/sub-user.guard';

@ApiTags('AI')
@Controller('v2') 
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  /**
   * 🚀 SKIN SCAN ENDPOINT
   * This is the "Everything Hub" for the Scanner and Ingredient Checker.
   */
  @Post('skin-diagnosis')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: 'Upload skin image for AI diagnosis',
    description: 'Upload an image and get a detailed AI analysis of skin conditions'
  })
  @ApiBody({
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
  })
  async scan(
    @UploadedFile() file: any,
    @Body('more_info') moreInfo: string,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required for analysis');
    }

    if (!moreInfo) {
      throw new BadRequestException('The "more_info" field is required for skin analysis');
    }

    const userInfo = this.extractUserId(req.user);
    
    const analyzer = await this.analyzerService.scanAndSave(
      file,
      userInfo.id,
      moreInfo
    );

    return {
      succeeded: true,
      message: 'AI Analysis completed successfully',
      resultData: analyzer, 
    };
  }

  @Post('skintone-analysis')
  @ApiOperation({ summary: 'Upload skin image for AI skintone analysis' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  async analyzeSkintone(
      @UploadedFile() file: any, 
      @Request() req: any,
      @Body('more_info') moreInfo: string
  ) {
      if (!file) {
        throw new BadRequestException('Image file is required for skintone analysis');
      }

      if (!moreInfo) {
        throw new BadRequestException('The "more_info" field is required for skintone analysis');
      }

      const userInfo = this.extractUserId(req.user);
      const result = await this.analyzerService.analyzeSkintoneAndSave(file, userInfo.id, moreInfo);
      return {
          succeeded: true,
          message: 'Skintone analysis complete',
          resultData: result
      };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new analyzer' })
  async create(
    @Body() createAnalyzerDto: CreateAnalyzerDto,
    @Request() req: any,
  ) {
    const userInfo = this.extractUserId(req.user);
    const analyzer = await this.analyzerService.createAnalyzer(
      { ...createAnalyzerDto },
      userInfo.id,
      userInfo.type,
    );
    return {
      succeeded: true,
      message: 'Analyzer created successfully',
      resultData: analyzer,
    };
  }
    
  @Get('health-check')
  @ApiOperation({ summary: 'Check AI Service Health' })
  async checkHealth() {
      return this.analyzerService.checkHealth();
  }

  @Get()
  @ApiOperation({ summary: 'Get my analyzer' })
  async getMyAnalyzer(@Request() req: any) {
    const userInfo = this.extractUserId(req.user);
    return this.analyzerService.getAnalyzerByUserId(userInfo.id, userInfo.type);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all analyzers' })
  async getAllAnalyzers() {
    return this.analyzerService.getAllAnalyzers();
  }

  @Get(':id')
  @UseGuards(SubUserGuard) // 🛡️ SUBSCRIPTION GATEKEEPER
  @ApiOperation({ summary: 'Get analyzer by ID' })
  async getAnalyzer(@Param('id') id: string) {
    return this.analyzerService.getAnalyzerById(id);
  }

  @Get('result/:userId')
  @ApiOperation({ summary: 'Get analyzer by UseID' })
  async getAnalyzersbyUserId(@Param('userId') id: string) {
    return this.analyzerService.getAnalyzersByUserId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update analyzer by ID' })
  async updateAnalyzer(
    @Param('id') id: string,
    @Body() updateAnalyzerDto: Partial<UpdateAnalyzerDto>,
  ) {
    const analyzer = await this.analyzerService.updateAnalyzer(
      id,
      updateAnalyzerDto,
    );
    return {
      succeeded: true,
      message: 'Analyzer updated successfully',
      resultData: analyzer,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete analyzer by ID' })
  async deleteAnalyzer(@Param('id') id: string) {
    return this.analyzerService.deleteAnalyzer(id);
  }

  private extractUserId(user: any): { id: string; type: string } {
    if (!user) throw new BadRequestException('User authentication required');
    if (user.id) return { id: user.id, type: 'user' };
    if (user.user?.id) return { id: user.user.id, type: 'user' };
    if (user.sub) return { id: user.sub, type: 'user' };
    throw new BadRequestException('User ID could not be identified from token');
  }
}