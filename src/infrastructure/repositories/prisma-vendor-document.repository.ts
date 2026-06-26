import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { IVendorDocumentRepository } from 'src/domain/repositories/vendor-document.repository.interface';
import { VendorDocumentEntity } from 'src/domain/entities/vendor-document.entity';
import { VendorDocumentMapper } from '../mappers/vendor-document.mapper';

@Injectable()
export class PrismaVendorDocumentRepository implements IVendorDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByVendorId(vendorId: string): Promise<VendorDocumentEntity | null> {
    const raw = await this.prisma.vendorDocument.findUnique({ where: { vendorId } });
    return raw ? VendorDocumentMapper.toDomain(raw) : null;
  }

  async upsert(vendorId: string, data: Partial<VendorDocumentEntity>): Promise<VendorDocumentEntity> {
    const persistence = VendorDocumentMapper.toPersistence(data);
    const raw = await this.prisma.vendorDocument.upsert({
      where: { vendorId },
      create: { vendorId, ...persistence },
      update: persistence,
    });
    return VendorDocumentMapper.toDomain(raw);
  }
}
