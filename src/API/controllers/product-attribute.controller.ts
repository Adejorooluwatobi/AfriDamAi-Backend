import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductAttributeEntity } from 'src/domain/entities/product-attribute.entity';
import { CreateProductAttributeDto } from 'src/application/DTOs/attributes/create-product-attribute.dto';
import { UpdateProductAttributeDto } from 'src/application/DTOs/attributes/update-product-attribute.dto';
import { ProductAttributeService } from 'src/domain/services/product-attribute.service';

@ApiExtraModels(CreateProductAttributeDto)
@Controller('product-attributes')
export class ProductAttributeController {
  constructor(private readonly productAttrService: ProductAttributeService) {}

  @Post()
  //@UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create Product Attribute' })
  @ApiResponse({ status: 201, description: 'productAttr created successfully', type: ProductAttributeEntity })
  async Create(@Body(new ValidationPipe()) CreateProductAttributeDto: CreateProductAttributeDto) {
    const productAttr = await this.productAttrService.createProduct(CreateProductAttributeDto);
    if (!productAttr) {
      throw new InternalServerErrorException('productAttr creation failed');
    }
    return {
      succeeded: true,
      message: 'productAttr created successfully',
      resultData: productAttr,
    };
  }

  @Get(':id')
    @ApiOperation({ summary: 'Retreive Product attribute by Id' })
    @ApiResponse({ status: 200, description: 'ProductAttr retrieved successfully', type: ProductAttributeEntity })
    async findById(@Param('id') id:string) {
      const productAttr = await this.productAttrService.findById(id);
      return {
        succeeded: true,
        message: 'ProductAttr retrieved successfully',
        resultData: productAttr,
      };
    }
  
    @Get('product/:productId')
    @ApiOperation({ summary: 'Retrieve a ProductAttributes by ProductId' })
    @ApiResponse({ status: 200, description: 'productAttrs retrieved successfully', type: [ProductAttributeEntity] })
    async findByProductId(@Param('productId') id: string) {
      const productAttrs = await this.productAttrService.findByProductId(id);
      if (!productAttrs) {
        throw new NotFoundException(`productAttrs with Productid ${id} not found`);
      }
      return {
        succeeded: true,
        message: 'productAttrs retrieved successfully',
        resultData: productAttrs,
      };
    }

    @Delete(':id')
      @ApiOperation({ summary: 'Delete a Product Attribute by ID' })
      async delete(@Param('id') id: string) {
        await this.productAttrService.delete(id);
        return {
          succeeded: true,
          message: 'productAttr deleted successfully',
        };
      }

        @Put(':id')
        //@UseGuards(AdminGuard)
        @ApiBearerAuth()
        @ApiOperation({ summary: 'Update a Product Attribute by ID' })
        @ApiResponse({ status: 200, description: 'productAttr updated successfully', type: ProductAttributeEntity })
        async update(
          @Param('id') id: string,
          @Body(new ValidationPipe({transform:true,whitelist:true})) UpdateProductAttributeDto: UpdateProductAttributeDto,
        ) {
          const productAttr = await this.productAttrService.updateProduct(
            id,
            UpdateProductAttributeDto,
          );
          if (!productAttr) {
            throw new NotFoundException(`productAttr with id ${id} not found`);
          }
          return {
            succeeded: true,
            message: 'productAttr updated successfully',
            resultData: productAttr,
          };
        }

}
