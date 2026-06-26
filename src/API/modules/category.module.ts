import { Module } from "@nestjs/common";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "src/domain/services/category.service";
import { PrismaCategoryRepository } from "src/infrastructure/persistence/prisma/prisma-category.repository";
import { PrismaModule } from "src/infrastructure/persistence/prisma/prisma.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports:[PrismaModule, AuthModule],
    controllers:[CategoryController],
    providers:[CategoryService,{provide:'CategoryRepository',useClass:PrismaCategoryRepository}],
    exports:[CategoryService]
})
export class CategoryModule{}