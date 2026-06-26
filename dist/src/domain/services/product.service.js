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
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const admin_notification_service_1 = require("./admin-notification.service");
const mail_service_1 = require("../../infrastructure/messaging/mail/mail.service");
const vendor_service_1 = require("./vendor.service");
const slugify_1 = require("../../utils/slugify");
let ProductService = ProductService_1 = class ProductService {
    constructor(productRepository, categoryRepository, adminNotificationService, mailService, vendorService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.adminNotificationService = adminNotificationService;
        this.mailService = mailService;
        this.vendorService = vendorService;
        this.logger = new common_1.Logger(ProductService_1.name);
    }
    normalizeName(name) {
        return name?.trim();
    }
    ensureNameIsValid(name) {
        if (!name || !name.trim()) {
            throw new common_1.BadRequestException('Prod name must not be empty');
        }
    }
    async generateUniqueSlug(name, excludeId) {
        const baseSlug = (0, slugify_1.slugify)(name);
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.productRepository.findBySlug(slug);
            if (!existing || (excludeId && existing.id === excludeId))
                break;
            slug = `${baseSlug}-${counter++}`;
        }
        return slug;
    }
    async createProduct(productDetails) {
        const name = this.normalizeName(productDetails.name);
        this.ensureNameIsValid(name);
        const slug = await this.generateUniqueSlug(name);
        if (productDetails.primaryCategoryId) {
            const primaryCategory = await this.categoryRepository.findById(productDetails.primaryCategoryId);
            if (!primaryCategory) {
                throw new common_1.BadRequestException(`Primary category ${productDetails.primaryCategoryId} does not exist`);
            }
        }
        if (productDetails.secondaryCategoryIds &&
            productDetails.secondaryCategoryIds.length) {
            for (const categoryId of productDetails.secondaryCategoryIds) {
                const category = await this.categoryRepository.findById(categoryId);
                if (!category) {
                    throw new common_1.BadRequestException(`Secondary category ${categoryId} does not exist`);
                }
            }
        }
        const newProduct = await this.productRepository.create({
            ...productDetails,
            name,
            slug,
            isActive: productDetails.isActive ?? true,
        });
        this.logger.log('Product created successfully', productDetails);
        this.logger.log('Product created successfully', newProduct.id);
        this.logger.log('Product created successfully', newProduct);
        try {
            await this.adminNotificationService.notify('SALES', 'New Product Added', `<p>A new product has been added to the catalog.</p>
           <p><strong>Product:</strong> ${newProduct.name}</p>
           <p><strong>Price:</strong> ₦${newProduct.basePrice}</p>
           <p><strong>Vendor ID:</strong> ${newProduct.vendorId}</p>`, false);
        }
        catch (e) {
            this.logger.error('Failed to notify admins about new product', e);
        }
        return newProduct;
    }
    async findAllProducts() {
        const products = await this.productRepository.findAll();
        return products;
    }
    async findOneProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }
    async findOneProductBySlug(slug) {
        const product = await this.productRepository.findBySlug(slug);
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug ${slug} not found`);
        }
        return product;
    }
    async findProductsByCategory(categoryId) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new common_1.NotFoundException(`Category with Id "${categoryId}" not found`);
        }
        return this.productRepository.findByCategory(categoryId);
    }
    async findProductsByVendor(vendorId) {
        const vendor = await this.productRepository.findByVendor(vendorId);
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor with Id "${vendorId}" not found`);
        }
        return this.productRepository.findByVendor(vendorId);
    }
    async searchProducts(term) {
        if (!term || !term.trim()) {
            throw new common_1.BadRequestException('Search term cannot be empty');
        }
        return this.productRepository.searchProducts(term);
    }
    async deleteProduct(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        await this.productRepository.delete(id);
        this.logger.log('Product deleted successfully', product.id);
        try {
            const vendorData = await this.vendorService.findOneVendor(product.vendorId);
            if (vendorData && vendorData.vendor) {
                await this.mailService.sendProductDeletedEmail(vendorData.vendor.email, product.name, 'Administative removal');
            }
        }
        catch (e) {
            this.logger.error(`Failed to notify vendor on product deletion: ${id}`, e);
        }
    }
    async updateProduct(id, params) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with id ${id} not found`);
        }
        if (params.name !== undefined) {
            const normalized = this.normalizeName(params.name);
            this.ensureNameIsValid(normalized);
            params.name = normalized;
        }
        if (params.primaryCategoryId) {
            const primaryCategory = await this.categoryRepository.findById(params.primaryCategoryId);
            if (!primaryCategory) {
                throw new common_1.BadRequestException(`Primary category ${params.primaryCategoryId} does not exist`);
            }
        }
        if (params.secondaryCategoryIds?.length) {
            for (const categoryId of params.secondaryCategoryIds) {
                const category = await this.categoryRepository.findById(categoryId);
                if (!category) {
                    throw new common_1.BadRequestException(`Secondary category ${categoryId} does not exist`);
                }
            }
        }
        const update = await this.productRepository.update(id, params);
        this.logger.log('Product updated successfully', update.id);
        return update;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __param(1, (0, common_1.Inject)('CategoryRepository')),
    __metadata("design:paramtypes", [Object, Object, admin_notification_service_1.AdminNotificationService,
        mail_service_1.MailService,
        vendor_service_1.VendorService])
], ProductService);
//# sourceMappingURL=product.service.js.map