import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags,ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttributeValueService } from '../../domain/services/attribute-value.service';
import { CreateAttributeValueDto } from '../../application/DTOs/attributes/create-attribute-value.dto';
import { UpdateAttributeValueDto } from '../../application/DTOs/attributes/update-attribute-value.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards';
import { AttributeValueEntity } from 'src/domain/entities/atrribute-value.entity';

@ApiTags('Attribute Values')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attribute-values')
export class AttributeValueController {
  constructor(private readonly attributeValueService: AttributeValueService) {}

  @UseGuards(AdminGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new attribute value' })
  @ApiResponse({ status: 201, description: 'Attribute value created successfully', type: AttributeValueEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Value already exists for this attribute' })
  create(@Body() dto: CreateAttributeValueDto) {
    return this.attributeValueService.createAttributeValue(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attribute values' })
  @ApiResponse({ status: 200, description: 'List of attribute values' })
  @ApiResponse({ status: 201, type: AttributeValueEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.attributeValueService.findAllAttributeValues();
  }

  @Get('attribute/:attributeId')
  @ApiOperation({ summary: 'Get all values for an attribute' })
  @ApiResponse({ status: 201, type: AttributeValueEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByAttributeId(@Param('attributeId') attributeId: string) {
    return this.attributeValueService.findByAttributeId(attributeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute value by ID' })
  @ApiResponse({ status: 201, type: AttributeValueEntity })
  @ApiResponse({ status: 404, description: 'Attribute value not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.attributeValueService.findOneAttributeValue(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an attribute value' })
  @ApiResponse({ status: 201, type: AttributeValueEntity })
  @ApiResponse({ status: 404, description: 'Attribute value not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Value already exists for this attribute' })
  update(@Param('id') id: string, @Body() dto: UpdateAttributeValueDto) {
    return this.attributeValueService.updateAttributeValue(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attribute value' })
  @ApiResponse({ status: 204, description: 'Attribute value deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attribute value not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.attributeValueService.deleteAttributeValue(id);
  }
}
