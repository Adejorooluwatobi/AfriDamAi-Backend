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
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from 'src/application/DTOs/products/create-product.dto';
import { UpdateProductDto } from 'src/application/DTOs/products/update-product.dto';
import { ProductService } from 'src/domain/services/product.service';
import { AdminGuard, VendorGuard } from '../auth/guards';
import { ProductEntity } from 'src/domain/entities/product.entity';

@ApiExtraModels(CreateProductDto)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(VendorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({ status: 201, type: ProductEntity })
  async Create(
    @Req() request: any,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) CreateProductDto: CreateProductDto
  ) {
    CreateProductDto.vendorId = request.vendor.sub; // Inject vendor ID from token payload (sub contains vendor ID)
    const product = await this.productService.createProduct(CreateProductDto as any);
    if (!product) {
      throw new InternalServerErrorException('Product creation failed');
    }
    return {
      succeeded: true,
      message: 'Product created successfully',
      resultData: product,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retreive all products' })
  @ApiResponse({ status: 200, type: [ProductEntity] })
  async findAll() {
    const products = await this.productService.findAllProducts();
    return {
      succeeded: true,
      message: 'Products retrieved successfully',
      resultData: products,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a Product by ID' })
  @ApiResponse({ status: 201, type: ProductEntity })
  async findOneProductById(@Param('id') id: string) {
    const product = await this.productService.findOneProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Product retrieved successfully',
      resultData: product,
    };
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Retrieve a Product by vendorId' })
  @ApiResponse({ status: 201, type: ProductEntity })
  async findProductsByVendor(@Param('vendorId') id: string) {
    const product = await this.productService.findProductsByVendor(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Product retrieved successfully',
      resultData: product,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  async delete(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return {
      succeeded: true,
      message: 'Product deleted successfully',
    };
  }

  @Put(':id')
  @UseGuards(VendorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 201, type: ProductEntity })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    UpdateProductDto: UpdateProductDto,
  ) {
    const products = await this.productService.updateProduct(
      id,
      UpdateProductDto,
    );
    if (!products) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Product updated successfully',
      resultData: products,
    };
  }


  @Get('slug/:slug')
  @ApiOperation({summary:'Retrieve Products by Slug'})
  @ApiResponse({ status: 201, type: ProductEntity })
  async findOneProductBySlug(@Param('slug') slug:string)
  {
    const product = await this.productService.findOneProductBySlug(slug)
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return {
      succeeded: true,
      message: 'Product retrieved successfully',
      resultData: product,
    };
  }

  @Get('category/:categoryId')
  @ApiOperation({summary:'Retrieve Products by Category'})
  @ApiResponse({ status: 201, type: ProductEntity })
  async findOneProductByCategory(@Param('categoryId') categoryId:string)
  {
    const product = await this.productService.findProductsByCategory(categoryId)
    if (!product) {
      throw new NotFoundException(`Product with category ${categoryId} not found`);
    }
    return {
      succeeded: true,
      message: 'Product retrieved successfully',
      resultData: product,
    };
  }

  @Get('search/:term')
  @ApiOperation({summary:'Search Products'})
  @ApiResponse({ status: 201, type: ProductEntity })
  async searchProducts(@Param('term') term:string)
  {
    const product = await this.productService.searchProducts(term)
    if (!product) {
      throw new NotFoundException(`Product with slug ${term} not found`);
    }
    return {
      succeeded: true,
      message: 'Product retrieved successfully',
      resultData: product,
    };
  }
}
