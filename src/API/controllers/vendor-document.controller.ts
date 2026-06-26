import {
  Controller, Get, Put, Body, Request, UseGuards, ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorDocumentService } from 'src/domain/services/vendor-document.service';
import { UpsertVendorDocumentDto } from 'src/application/DTOs/documents/upsert-vendor-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Vendor Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendor-documents')
export class VendorDocumentController {
  constructor(private readonly vendorDocumentService: VendorDocumentService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my vendor document profile' })
  async getMyDocument(@Request() req: any) {
    return this.vendorDocumentService.getDocument(req.user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Create or update my vendor document profile (bank details, CAC docs, director info, etc.)' })
  async upsertMyDocument(
    @Request() req: any,
    @Body(ValidationPipe) dto: UpsertVendorDocumentDto,
  ) {
    return this.vendorDocumentService.upsertDocument(req.user.id, dto);
  }
}
