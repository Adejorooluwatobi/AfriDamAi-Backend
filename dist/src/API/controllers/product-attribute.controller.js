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
exports.ProductAttributeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_attribute_entity_1 = require("../../domain/entities/product-attribute.entity");
const create_product_attribute_dto_1 = require("../../application/DTOs/attributes/create-product-attribute.dto");
const update_product_attribute_dto_1 = require("../../application/DTOs/attributes/update-product-attribute.dto");
const product_attribute_service_1 = require("../../domain/services/product-attribute.service");
let ProductAttributeController = class ProductAttributeController {
    constructor(productAttrService) {
        this.productAttrService = productAttrService;
    }
    async Create(CreateProductAttributeDto) {
        const productAttr = await this.productAttrService.createProduct(CreateProductAttributeDto);
        if (!productAttr) {
            throw new common_1.InternalServerErrorException('productAttr creation failed');
        }
        return {
            succeeded: true,
            message: 'productAttr created successfully',
            resultData: productAttr,
        };
    }
    async findById(id) {
        const productAttr = await this.productAttrService.findById(id);
        return {
            succeeded: true,
            message: 'ProductAttr retrieved successfully',
            resultData: productAttr,
        };
    }
    async findByProductId(id) {
        const productAttrs = await this.productAttrService.findByProductId(id);
        if (!productAttrs) {
            throw new common_1.NotFoundException(`productAttrs with Productid ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'productAttrs retrieved successfully',
            resultData: productAttrs,
        };
    }
    async delete(id) {
        await this.productAttrService.delete(id);
        return {
            succeeded: true,
            message: 'productAttr deleted successfully',
        };
    }
    async update(id, UpdateProductAttributeDto) {
        const productAttr = await this.productAttrService.updateProduct(id, UpdateProductAttributeDto);
        if (!productAttr) {
            throw new common_1.NotFoundException(`productAttr with id ${id} not found`);
        }
        return {
            succeeded: true,
            message: 'productAttr updated successfully',
            resultData: productAttr,
        };
    }
};
exports.ProductAttributeController = ProductAttributeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Product Attribute' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'productAttr created successfully', type: product_attribute_entity_1.ProductAttributeEntity }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_attribute_dto_1.CreateProductAttributeDto]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "Create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retreive Product attribute by Id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ProductAttr retrieved successfully', type: product_attribute_entity_1.ProductAttributeEntity }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a ProductAttributes by ProductId' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'productAttrs retrieved successfully', type: [product_attribute_entity_1.ProductAttributeEntity] }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a Product Attribute by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a Product Attribute by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'productAttr updated successfully', type: product_attribute_entity_1.ProductAttributeEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_attribute_dto_1.UpdateProductAttributeDto]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "update", null);
exports.ProductAttributeController = ProductAttributeController = __decorate([
    (0, swagger_1.ApiExtraModels)(create_product_attribute_dto_1.CreateProductAttributeDto),
    (0, common_1.Controller)('product-attributes'),
    __metadata("design:paramtypes", [product_attribute_service_1.ProductAttributeService])
], ProductAttributeController);
//# sourceMappingURL=product-attribute.controller.js.map