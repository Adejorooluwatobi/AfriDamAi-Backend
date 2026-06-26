import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISpecialistDocumentRepository } from '../repositories/specialist-document.repository.interface';
import { SpecialistDocumentEntity } from '../entities/specialist-document.entity';

@Injectable()
export class SpecialistDocumentService {
  constructor(
    @Inject('ISpecialistDocumentRepository')
    private readonly repo: ISpecialistDocumentRepository,
  ) {}

  async getDocument(specialistId: string): Promise<SpecialistDocumentEntity> {
    const doc = await this.repo.findBySpecialistId(specialistId);
    if (!doc) throw new NotFoundException('Specialist document profile not found');
    return doc;
  }

  async upsertDocument(
    specialistId: string,
    data: Partial<SpecialistDocumentEntity>,
  ): Promise<SpecialistDocumentEntity> {
    return this.repo.upsert(specialistId, data);
  }
}
