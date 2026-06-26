import { Module } from "@nestjs/common";
import { PrismaModule } from "src/infrastructure/persistence/prisma/prisma.module";
import { CartController } from "../controllers/cart.controller";
import { CartService } from "src/domain/services/cart.service";
import { PrismaCartRepository } from "src/infrastructure/persistence/prisma/prisma-cart.repository";

@Module({
    imports:[PrismaModule],
    controllers:[CartController],
    providers:[CartService,{provide:'CartRepository',useClass:PrismaCartRepository}],
    exports:[CartService]
})
export class CartModule{}