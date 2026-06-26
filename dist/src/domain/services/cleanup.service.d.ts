import { OrderService } from './order.service';
import { TransactionService } from './transaction.service';
import { OrderRepositoryInterface } from '../repositories/order.repository.interface';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
export declare class CleanupService {
    private readonly orderRepository;
    private readonly transactionRepository;
    private readonly orderService;
    private readonly transactionService;
    private readonly prisma;
    private readonly logger;
    constructor(orderRepository: OrderRepositoryInterface, transactionRepository: ITransactionRepository, orderService: OrderService, transactionService: TransactionService, prisma: PrismaService);
    handleInactivityCleanup(): Promise<void>;
    handleOrderCleanup(): Promise<void>;
    handleTransactionCleanup(): Promise<void>;
    handlePendingSubscriptionCleanup(): Promise<void>;
}
