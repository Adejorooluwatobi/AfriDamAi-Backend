import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IOrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { OrganizationEntity } from '../../../domain/entities/organization.entity';
import { OrganizationMapper } from '../../mappers/organization.mapper';

@Injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    const org = await this.prisma.organization.create({
      data: {
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
        address: data.address,
        logoUrl: data.logoUrl,
        brandingColors: data.brandingColors ? JSON.parse(JSON.stringify(data.brandingColors)) : undefined,
        licenseUrl: data.licenseUrl,
        licenseNumber: data.licenseNumber,
        status: data.status,
        isActive: data.isActive ?? true,
      },
    });
    return OrganizationMapper.toDomain(org);
  }

  async findById(id: string): Promise<OrganizationEntity | null> {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async findByEmail(email: string): Promise<OrganizationEntity | null> {
    const org = await this.prisma.organization.findUnique({ where: { email } });
    return org ? OrganizationMapper.toDomain(org) : null;
  }

  async findAll(): Promise<OrganizationEntity[]> {
    const orgs = await this.prisma.organization.findMany();
    return OrganizationMapper.toDomainArray(orgs);
  }

  async update(id: string, data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    const org = await this.prisma.organization.update({
      where: { id },
      data: {
        ...data,
      },
    });
    return OrganizationMapper.toDomain(org);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({ where: { id } });
  }

  async findActive(): Promise<OrganizationEntity[]> {
    const orgs = await this.prisma.organization.findMany({ where: { isActive: true } });
    return OrganizationMapper.toDomainArray(orgs);
  }
}
