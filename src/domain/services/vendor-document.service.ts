import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IVendorDocumentRepository } from '../repositories/vendor-document.repository.interface';
import { VendorDocumentEntity } from '../entities/vendor-document.entity';

@Injectable()
export class VendorDocumentService {
  constructor(
    @Inject('IVendorDocumentRepository')
    private readonly repo: IVendorDocumentRepository,
  ) {}

  async getDocument(vendorId: string): Promise<VendorDocumentEntity> {
    const doc = await this.repo.findByVendorId(vendorId);
    if (!doc) throw new NotFoundException('Vendor document profile not found');
    return doc;
  }

  async upsertDocument(
    vendorId: string,
    data: Partial<VendorDocumentEntity>,
  ): Promise<VendorDocumentEntity> {
    return this.repo.upsert(vendorId, data);
  }
}
