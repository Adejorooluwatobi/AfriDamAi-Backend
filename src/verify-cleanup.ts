import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WalletService } from './domain/services/wallet.service';
import { CleanupService } from './domain/services/cleanup.service';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { WalletOwnerType, WalletTransactionType, AdminType } from '@prisma/client';
import { OrderStatus } from './domain/entities/order.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const walletService = app.get(WalletService);
  const cleanupService = app.get(CleanupService);
  const prisma = app.get(PrismaService);

  console.log('--- Verification Started ---');

  try {
    // 1. Verify Wallet Stats
    const superAdmin = await prisma.admin.findFirst({ where: { type: AdminType.SUPER_ADMIN } });
    if (superAdmin) {
      console.log(`Using SUPER_ADMIN: ${superAdmin.email}`);
      const wallet = await walletService.getWalletByOwner(superAdmin.id, WalletOwnerType.ORGANIZATION);
      console.log('Organization Wallet Stats:');
      console.log(`- Balance: ${wallet.balance}`);
      console.log(`- Total In: ${wallet.totalIn}`);
      console.log(`- Total Out: ${wallet.totalOut}`);
    } else {
      console.log('No SUPER_ADMIN found for wallet stats verification.');
    }

    // 2. Verify Cleanup Logic
    console.log('Testing Cleanup Logic...');
    
    // Create a stale pending order (25h ago)
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

      // Create a stale transaction (40m ago)
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

      // Run cleanup
      console.log('Running Order Cleanup...');
      await cleanupService.handleOrderCleanup();
      
      console.log('Running Transaction Cleanup...');
      await cleanupService.handleTransactionCleanup();

      // Verify results
      const updatedOrder = await prisma.order.findUnique({ where: { id: staleOrder.id } });
      const updatedTx = await prisma.transaction.findUnique({ where: { id: staleTx.id } });

      console.log(`Order status after cleanup: ${updatedOrder?.status} (Expected: CANCELLED)`);
      console.log(`Transaction status after cleanup: ${updatedTx?.status} (Expected: FAILED)`);

      // Cleanup test data
      await prisma.transaction.delete({ where: { id: staleTx.id } });
      await prisma.order.delete({ where: { id: staleOrder.id } });
      console.log('Test data cleaned up.');
    } else {
      console.log('No user found for cleanup logic verification.');
    }

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await app.close();
    console.log('--- Verification Finished ---');
  }
}

bootstrap();
