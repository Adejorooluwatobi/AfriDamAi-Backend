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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_1 = require("../../application/DTOs/products/create-product.dto");
const update_product_dto_1 = require("../../application/DTOs/products/update-product.dto");
const product_service_1 = require("../../domain/services/product.service");
const guards_1 = require("../auth/guards");
const product_entity_1 = require("../../domain/entities/product.entity");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async Create(request, CreateProductDto) {
        CreateProductDto.vendorId = request.vendor.sub;
        const product = await this.productService.createProduct(CreateProductDto);
        if (!product) {
            throw new common_1.InternalServerErrorException('Product creation failed');
        }
        return {
            succeeded: true,
            message: 'Product created successfully',
            resultData: product,
        };
    }
    async findAll() {
        const products = await this.productService.findAllProducts();
        return {
            succeeded: true,
            message: 'Products retrieved successfully',
            resultData: products,
        };
    }
    async findOneProductById(id) {
        const product = await this.productService.findOneProductById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Product retrieved successfully',
            resultData: product,
        };
    }
    async findProductsByVendor(id) {
        const product = await this.productService.findProductsByVendor(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Product retrieved successfully',
            resultData: product,
        };
    }
    async delete(id) {
        await this.productService.deleteProduct(id);
        return {
            succeeded: true,
            message: 'Product deleted successfully',
        };
    }
    async update(id, UpdateProductDto) {
        const products = await this.productService.updateProduct(id, UpdateProductDto);
        if (!products) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'Product updated successfully',
            resultData: products,
        };
    }
    async findOneProductBySlug(slug) {
        const product = await this.productService.findOneProductBySlug(slug);
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
        }
        return {
            succeeded: true,
            message: 'Product retrieved successfully',
            resultData: product,
        };
    }
    async findOneProductByCategory(categoryId) {
        const product = await this.productService.findProductsByCategory(categoryId);
        if (!product) {
            throw new common_1.NotFoundException(`Product with category ${categoryId} not found`);
        }
        return {
            succeeded: true,
            message: 'Product retrieved successfully',
            resultData: product,
        };
    }
    async searchProducts(term) {
        const product = await this.productService.searchProducts(term);
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${term} not found`);
        }
        return {
            succeeded: true,
            message: 'Product retrieved successfully',
            resultData: product,
        };
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.VendorGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Product' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "Create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retreive all products' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [product_entity_1.ProductEntity] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a Product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOneProductById", null);
__decorate([
    (0, common_1.Get)('vendor/:vendorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a Product by vendorId' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Param)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findProductsByVendor", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.VendorGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve Products by Slug' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOneProductBySlug", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve Products by Category' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOneProductByCategory", null);
__decorate([
    (0, common_1.Get)('search/:term'),
    (0, swagger_1.ApiOperation)({ summary: 'Search Products' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: product_entity_1.ProductEntity }),
    __param(0, (0, common_1.Param)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProducts", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_product_dto_1.CreateProductDto),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map