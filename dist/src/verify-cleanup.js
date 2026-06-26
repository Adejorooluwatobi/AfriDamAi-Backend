"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const wallet_service_1 = require("./domain/services/wallet.service");
const cleanup_service_1 = require("./domain/services/cleanup.service");
const prisma_service_1 = require("./infrastructure/persistence/prisma/prisma.service");
const client_1 = require("@prisma/client");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const walletService = app.get(wallet_service_1.WalletService);
    const cleanupService = app.get(cleanup_service_1.CleanupService);
    const prisma = app.get(prisma_service_1.PrismaService);
    console.log('--- Verification Started ---');
    try {
        const superAdmin = await prisma.admin.findFirst({ where: { type: client_1.AdminType.SUPER_ADMIN } });
        if (superAdmin) {
            console.log(`Using SUPER_ADMIN: ${superAdmin.email}`);
            const wallet = await walletService.getWalletByOwner(superAdmin.id, client_1.WalletOwnerType.ORGANIZATION);
            console.log('Organization Wallet Stats:');
            console.log(`- Balance: ${wallet.balance}`);
            console.log(`- Total In: ${wallet.totalIn}`);
            console.log(`- Total Out: ${wallet.totalOut}`);
        }
        else {
            console.log('No SUPER_ADMIN found for wallet stats verification.');
        }
        console.log('Testing Cleanup Logic...');
        const twentyFiveHoursAgo = new Date();
        twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);
        const user = await prisma.user.findFirst();
        if (user) {
            const staleOrder = await prisma.order.create({
                data: {
                    userId: user.id,
                    totalAmount: 100,
                    shippingAddress: 'Test Address',
                    status: 'PENDING',
                    createdAt: twentyFiveHoursAgo,
                }
            });
            console.log(`Created stale order: ${staleOrder.id}`);
            const fortyMinutesAgo = new Date();
            fortyMinutesAgo.setMinutes(fortyMinutesAgo.getMinutes() - 40);
            const staleTx = await prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: 100,
                    status: 'PENDING',
                    gateway: 'PAYSTACK',
                    createdAt: fortyMinutesAgo,
                    orderId: staleOrder.id
                }
            });
            console.log(`Created stale transaction: ${staleTx.id}`);
            console.log('Running Order Cleanup...');
            await cleanupService.handleOrderCleanup();
            console.log('Running Transaction Cleanup...');
            await cleanupService.handleTransactionCleanup();
            const updatedOrder = await prisma.order.findUnique({ where: { id: staleOrder.id } });
            const updatedTx = await prisma.transaction.findUnique({ where: { id: staleTx.id } });
            console.log(`Order status after cleanup: ${updatedOrder?.status} (Expected: CANCELLED)`);
            console.log(`Transaction status after cleanup: ${updatedTx?.status} (Expected: FAILED)`);
            await prisma.transaction.delete({ where: { id: staleTx.id } });
            await prisma.order.delete({ where: { id: staleOrder.id } });
            console.log('Test data cleaned up.');
        }
        else {
            console.log('No user found for cleanup logic verification.');
        }
    }
    catch (error) {
        console.error('Verification failed:', error);
    }
    finally {
        await app.close();
        console.log('--- Verification Finished ---');
    }
}
bootstrap();
//# sourceMappingURL=verify-cleanup.js.map