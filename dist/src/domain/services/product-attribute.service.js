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
var ProductAttributeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAttributeService = void 0;
const common_1 = require("@nestjs/common");
let ProductAttributeService = ProductAttributeService_1 = class ProductAttributeService {
    constructor(productAttributeRepository) {
        this.productAttributeRepository = productAttributeRepository;
        this.logger = new common_1.Logger(ProductAttributeService_1.name);
    }
    async createProduct(params) {
        const newProductAttr = await this.productAttributeRepository.create(params);
        this.logger.log('ProductAttr created successfully', newProductAttr.id);
        return newProductAttr;
    }
    async findById(id) {
        const productsAttr = await this.productAttributeRepository.findById(id);
        return productsAttr;
    }
    async findByProductId(id) {
        const productsAttr = await this.productAttributeRepository.findByProductId(id);
        if (!productsAttr) {
            throw new common_1.NotFoundException(`ProductAttribute with Productid ${id} not found`);
        }
        return productsAttr;
    }
    async delete(id) {
        const productAttr = await this.productAttributeRepository.findById(id);
        if (!productAttr) {
            throw new common_1.NotFoundException(`ProductAttribute with id ${id} not found`);
        }
        await this.productAttributeRepository.delete(id);
        this.logger.log('ProductAttribute updated successfully', productAttr.id);
    }
    async updateProduct(id, params) {
        const productAttr = await this.productAttributeRepository.findById(id);
        if (!productAttr) {
            throw new common_1.NotFoundException(`ProductAttribute with id ${id} not found`);
        }
        const update = await this.productAttributeRepository.update(id, params);
        this.logger.log('ProductAttribute updated successfully', update.id);
        return update;
    }
};
exports.ProductAttributeService = ProductAttributeService;
exports.ProductAttributeService = ProductAttributeService = ProductAttributeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductAttributeRepository')),
    __metadata("design:paramtypes", [Object])
], ProductAttributeService);
//# sourceMappingURL=product-attribute.service.js.map