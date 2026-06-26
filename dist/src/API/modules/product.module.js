"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const product_controller_1 = require("../controllers/product.controller");
const product_service_1 = require("../../domain/services/product.service");
const prisma_product_repository_1 = require("../../infrastructure/persistence/prisma/prisma-product.repository");
const category_service_1 = require("../../domain/services/category.service");
const prisma_category_repository_1 = require("../../infrastructure/persistence/prisma/prisma-category.repository");
const auth_module_1 = require("../auth/auth.module");
const admin_module_1 = require("./admin.module");
const vendor_module_1 = require("./vendor.module");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, admin_module_1.AdminModule, vendor_module_1.VendorModule],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService, { provide: 'ProductRepository', useClass: prisma_product_repository_1.PrismaProductRepository }, category_service_1.CategoryService, { provide: 'CategoryRepository', useClass: prisma_category_repository_1.PrismaCategoryRepository }],
        exports: [product_service_1.ProductService, 'ProductRepository']
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map