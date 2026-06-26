import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('🔌 Prisma connecting to database in background...');
    this.$connect()
      .then(() => console.log('✅ Prisma connected successfully.'))
      .catch((error) => console.error('❌ Prisma background connection failed:', error));
  }

  async enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      try {
        await app.close();
      } catch (error) {
        console.error('Error during application shutdown:', error);
      }
    });
  }
}