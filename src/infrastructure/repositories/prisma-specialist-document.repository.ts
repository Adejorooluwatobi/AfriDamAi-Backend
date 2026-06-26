import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { ISpecialistDocumentRepository } from 'src/domain/repositories/specialist-document.repository.interface';
import { SpecialistDocumentEntity } from 'src/domain/entities/specialist-document.entity';
import { SpecialistDocumentMapper } from '../mappers/specialist-document.mapper';

@Injectable()
export class PrismaSpecialistDocumentRepository implements ISpecialistDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySpecialistId(specialistId: string): Promise<SpecialistDocumentEntity | null> {
    const raw = await this.prisma.specialistDocument.findUnique({ where: { specialistId } });
    return raw ? SpecialistDocumentMapper.toDomain(raw) : null;
  }

  async upsert(specialistId: string, data: Partial<SpecialistDocumentEntity>): Promise<SpecialistDocumentEntity> {
    const persistence = SpecialistDocumentMapper.toPersistence(data);
    const raw = await this.prisma.specialistDocument.upsert({
      where: { specialistId },
      create: { specialistId, ...persistence },
      update: persistence,
    });
    return SpecialistDocumentMapper.toDomain(raw);
  }
}
