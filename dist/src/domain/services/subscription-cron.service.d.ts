import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
export declare class SubscriptionCronService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleSubscriptionExpiry(): Promise<void>;
}
