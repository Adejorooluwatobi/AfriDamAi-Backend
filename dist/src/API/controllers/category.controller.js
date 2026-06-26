"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_entity_1 = require("../../domain/entities/category.entity");
const create_category_dto_1 = require("../../application/DTOs/categories/create-category.dto");
const category_service_1 = require("../../domain/services/category.service");
const guards_1 = require("../auth/guards");
const update_category_dto_1 = require("../../application/DTOs/categories/update-category.dto");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(CreateCategoryDto) {
        const category = await this.categoryService.createCategory(CreateCategoryDto);
        if (!category) {
            throw new common_1.InternalServerErrorException('Category creation failed');
        }
        return {
            succeeded: true,
            message: 'Category created successfully',
            resultData: category,
        };
    }
    async findAll() {
        const categories = await this.categoryService.findAllCategories();
        return {
            succeeded: true,
            message: 'Categories retrieved successfully',
            resultData: categories,
        };
    }
    async findUser(id) {
        const category = await this.categoryService.findOneCategoryById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Category retrieved successfully',
            resultData: category,
        };
    }
    async update(id, UpdateCategoryDto) {
        const category = await this.categoryService.updateCategory(id, UpdateCategoryDto);
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Category updated successfully',
            resultData: category,
        };
    }
    async delete(id) {
        await this.categoryService.deleteCategory(id);
        return {
            succeeded: true,
            message: 'Category deleted successfully',
        };
    }
    async getTree() {
        return {
            succeeded: true,
            message: 'Category tree fetched successfully',
            resultData: await this.categoryService.getCategoryTree(),
        };
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a Catergory' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully', type: category_entity_1.CategoryEntity }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categories retrieved successfully', type: [category_entity_1.CategoryEntity] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category retrieved successfully', type: category_entity_1.CategoryEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category updated successfully', type: category_entity_1.CategoryEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Category by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('category/tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Get categories in nested tree format' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category tree fetched successfully', type: [category_entity_1.CategoryEntity] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getTree", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_category_dto_1.CreateCategoryDto),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map