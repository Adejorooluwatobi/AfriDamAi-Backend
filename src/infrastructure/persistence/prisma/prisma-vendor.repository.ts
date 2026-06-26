import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { VendorEntity } from '../../../domain/entities/vendor.entity';
import { VendorMapper } from '../../mappers/vendor.mapper';
import { IVendorRepository } from 'src/domain/repositories/vendor.repository.interface';
import { CreateVendorParams, UpdateVendorParams } from 'src/utils/type';
import { Vendor } from '@prisma/client';

@Injectable()
export class PrismaVendorRepository implements IVendorRepository {
  constructor(private readonly prisma: PrismaService) {}



  async findById(id: string): Promise<VendorEntity | null> {
    const vendor = await this.prisma.vendor.findUnique({ 
      where: { id },
    });
    return vendor ? VendorMapper.toDomain(vendor as Vendor) : null;
  }

  async findByEmail(email: string): Promise<VendorEntity | null> {
    const vendor = await this.prisma.vendor.findUnique({ 
      where: { email },
    });
    return vendor ? VendorMapper.toDomain(vendor as Vendor) : null;
  }

  async findAll(): Promise<VendorEntity[]> {
    const vendor = await this.prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return VendorMapper.toDomainArray(vendor as Vendor[]);
  }

  async create(vendorData: CreateVendorParams): Promise<VendorEntity> {
    const vendor = await this.prisma.vendor.create({ 
      data: VendorMapper.toPersistence(vendorData as VendorEntity)
    });
    return VendorMapper.toDomain(vendor as Vendor);
  }

  async update(id: string, vendorData: Partial<UpdateVendorParams>): Promise<VendorEntity> {
    const { status, ...rest } = vendorData;
    const vendor = await this.prisma.vendor.update({ 
      where: { id }, 
      data: {
        ...rest,
        status: status as any
      }
    });
    return VendorMapper.toDomain(vendor as Vendor);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vendor.delete({ where: { id } });
  }
}