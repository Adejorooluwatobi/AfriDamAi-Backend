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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryEntity } from 'src/domain/entities/category.entity';
import { CreateCategoryDto } from 'src/application/DTOs/categories/create-category.dto';
import { CategoryService } from 'src/domain/services/category.service';
import { AdminGuard } from '../auth/guards';
import { UpdateCategoryDto } from 'src/application/DTOs/categories/update-category.dto';

@ApiExtraModels(CreateCategoryDto)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Catergory' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryEntity })
  async create(
    @Body(new ValidationPipe()) CreateCategoryDto: CreateCategoryDto,
  ) {
    const category =
      await this.categoryService.createCategory(CreateCategoryDto);
    if (!category) {
      throw new InternalServerErrorException('Category creation failed');
    }
    return {
      succeeded: true,
      message: 'Category created successfully',
      resultData: category,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryEntity] })
  async findAll() {
    const categories = await this.categoryService.findAllCategories();
    return {
      succeeded: true,
      message: 'Categories retrieved successfully',
      resultData: categories,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully', type: CategoryEntity })
  async findUser(@Param('id') id: string) {
    const category = await this.categoryService.findOneCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Category retrieved successfully',
      resultData: category,
    };
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryEntity })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    UpdateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.updateCategory(
      id,
      UpdateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Category updated successfully',
      resultData: category,
    };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Category by ID' })
  async delete(@Param('id') id: string) {
    await this.categoryService.deleteCategory(id);
    return {
      succeeded: true,
      message: 'Category deleted successfully',
    };
  }

  @Get('category/tree')
  @ApiOperation({ summary: 'Get categories in nested tree format' })
  @ApiResponse({ status: 200, description: 'Category tree fetched successfully', type: [CategoryEntity] })
  async getTree() {
    return {
      succeeded: true,
      message: 'Category tree fetched successfully',
      resultData: await this.categoryService.getCategoryTree(),
    };
  }
}
