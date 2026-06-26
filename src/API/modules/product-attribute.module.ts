import { Module } from "@nestjs/common";
import { PrismaModule } from "src/infrastructure/persistence/prisma/prisma.module";
import { ProductAttributeController } from "../controllers/product-attribute.controller";
import { ProductAttributeService } from "src/domain/services/product-attribute.service";
import { PrismaProductAttributeRepository } from "src/infrastructure/persistence/prisma/prisma-product-attribute.repository";

@Module({
    imports:[PrismaModule],
    controllers:[ProductAttributeController],
    providers:[ProductAttributeService,{provide:'ProductAttributeRepository',useClass:PrismaProductAttributeRepository}],
    exports:[ProductAttributeService]
})
export class ProductAttributeModule{}