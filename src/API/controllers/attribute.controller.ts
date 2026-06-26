import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttributeService } from '../../domain/services/attribute.service';
import { CreateAttributeDto } from '../../application/DTOs/attributes/create-attribute.dto';
import { UpdateAttributeDto } from '../../application/DTOs/attributes/update-attribute.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards';
import { AttributeEntity } from 'src/domain/entities/attribute.entity';

@ApiTags('Attributes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiResponse({ status: 201, description: 'Attribute created successfully', type: AttributeEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateAttributeDto) {
    return this.attributeService.createAttribute({
      name: dto.name,
      type: dto.type,
      isRequired: dto.isRequired ?? false,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all attributes' })
  @ApiResponse({ status: 200, description: 'List of all attributes', type: [AttributeEntity] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.attributeService.findAllAttributes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  @ApiResponse({ status: 200, description: 'Attribute found', type: AttributeEntity })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.attributeService.findOneAttribute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an attribute' })
  @ApiResponse({ status: 200, description: 'Attribute updated successfully', type: AttributeEntity })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributeService.updateAttribute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attribute' })
  @ApiResponse({ status: 204, description: 'Attribute deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.attributeService.deleteAttribute(id);
  }
}
