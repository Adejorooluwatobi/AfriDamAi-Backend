import { Module } from "@nestjs/common";
import { PrismaModule } from "src/infrastructure/persistence/prisma/prisma.module";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "src/domain/services/product.service";
import { PrismaProductRepository } from "src/infrastructure/persistence/prisma/prisma-product.repository";
import { CategoryService } from "src/domain/services/category.service";
import { PrismaCategoryRepository } from "src/infrastructure/persistence/prisma/prisma-category.repository";
import { AuthModule } from "../auth/auth.module";
import { AdminModule } from "./admin.module";
import { VendorModule } from "./vendor.module";

@Module({
    imports:[PrismaModule, AuthModule, AdminModule, VendorModule],
    controllers:[ProductController],
    providers:[ProductService,{provide:'ProductRepository',useClass:PrismaProductRepository},CategoryService,{provide:'CategoryRepository',useClass:PrismaCategoryRepository}],
    exports:[ProductService, 'ProductRepository']
})
export class ProductModule{}