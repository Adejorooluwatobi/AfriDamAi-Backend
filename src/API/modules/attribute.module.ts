import { Module } from '@nestjs/common';
import { AttributeController } from '../controllers/attribute.controller';
import { AttributeService } from '../../domain/services/attribute.service';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { PrismaAttributeRepository } from '../../infrastructure/persistence/prisma/prisma-attribute.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AttributeController],
  providers: [
    AttributeService,
    {
      provide: 'IAttributeRepository',
      useClass: PrismaAttributeRepository,
    },
    
  ],
  exports: [AttributeService],
})
export class AttributeModule {}
