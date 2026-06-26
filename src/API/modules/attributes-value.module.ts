import { Module } from '@nestjs/common';
import { AttributeValueController } from '../controllers/attribute-value.controller';
import { AttributeValueService } from '../../domain/services/attribute-value.service';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { PrismaAttributeValueRepository } from '../../infrastructure/persistence/prisma/prisma-attribute-value.repository';
import { PrismaAttributeRepository } from '../../infrastructure/persistence/prisma/prisma-attribute.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AttributeValueController],
  providers: [
    AttributeValueService,
    {
      provide: 'IAttributeValueRepository',
      useClass: PrismaAttributeValueRepository,
    },
    {
      provide: 'IAttributeRepository',
      useClass: PrismaAttributeRepository,
    },
  ],
  exports: [AttributeValueService],
})
export class AttributeValueModule {}