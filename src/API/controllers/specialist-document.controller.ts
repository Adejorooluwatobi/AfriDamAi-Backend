import {
  Controller, Get, Put, Body, Request, UseGuards, ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpecialistDocumentService } from 'src/domain/services/specialist-document.service';
import { UpsertSpecialistDocumentDto } from 'src/application/DTOs/documents/upsert-specialist-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Specialist Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('specialist-documents')
export class SpecialistDocumentController {
  constructor(private readonly specialistDocumentService: SpecialistDocumentService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my document profile' })
  async getMyDocument(@Request() req: any) {
    return this.specialistDocumentService.getDocument(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Create or update my document profile (bank details, licence, address, etc.)' })
  async upsertMyDocument(
    @Request() req: any,
    @Body(ValidationPipe) dto: UpsertSpecialistDocumentDto,
  ) {
    return this.specialistDocumentService.upsertDocument(req.user.id, dto);
  }
}
