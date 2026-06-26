import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AdminEntity } from '../../../domain/entities/admin.entity';
import { AdminMapper } from '../../mappers/admin.mapper';
import { IAdminRepository } from 'src/domain/repositories/admin.repository.interface';
import { CreateAdminParams, UpdateAdminParams } from 'src/utils/type';
import { Admin } from '@prisma/client';

@Injectable()
export class PrismaAdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaService) {}



  async findById(id: string): Promise<AdminEntity | null> {
    const admin = await this.prisma.admin.findUnique({ 
      where: { id },
    });
    return admin ? AdminMapper.toDomain(admin as Admin) : null;
  }

  async findByEmail(email: string): Promise<AdminEntity | null> {
    const admin = await this.prisma.admin.findUnique({ 
      where: { email },
    });
    return admin ? AdminMapper.toDomain(admin as Admin) : null;
  }

  async findByRole(role: any): Promise<AdminEntity[]> {
    const admins = await this.prisma.admin.findMany({
      where: { type: role },
      orderBy: { createdAt: 'asc' },
    });
    return AdminMapper.toDomainArray(admins as Admin[]);
  }

  async findAll(): Promise<AdminEntity[]> {
    const admin = await this.prisma.admin.findMany({
    });
    return AdminMapper.toDomainArray(admin as Admin[]);
  }

  async create(adminData: CreateAdminParams): Promise<AdminEntity> {
    const admin = await this.prisma.admin.create({ 
      data: AdminMapper.toPersistence(adminData as AdminEntity)
    });
    return AdminMapper.toDomain(admin as Admin);
  }

  async update(id: string, adminData: Partial<UpdateAdminParams>): Promise<AdminEntity> {
    const admin = await this.prisma.admin.update({ 
      where: { id }, 
      data: adminData as any
    });
    return AdminMapper.toDomain(admin as Admin);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({ where: { id } });
  }
}