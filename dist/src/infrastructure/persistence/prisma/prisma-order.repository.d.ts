import { OrderRepositoryInterface } from "src/domain/repositories/order.repository.interface";
import { PrismaService } from "./prisma.service";
import { OrderEntity } from "src/domain/entities/order.entity";
import { CreateOrderParams, UpdateOrderParams } from "src/utils/type";
export declare class PrismaOrderRepository implements OrderRepositoryInterface {
    private prisma;
    constructor(prisma: PrismaService);
    createTransactional(params: CreateOrderParams): Promise<OrderEntity>;
    findById(id: string): Promise<OrderEntity | null>;
    findByUserId(userId: string): Promise<OrderEntity[]>;
    findAll(): Promise<OrderEntity[]>;
    update(id: string, params: UpdateOrderParams): Promise<OrderEntity>;
    delete(id: string): Promise<void>;
    findPendingOrdersOlderThan(date: Date): Promise<OrderEntity[]>;
}
