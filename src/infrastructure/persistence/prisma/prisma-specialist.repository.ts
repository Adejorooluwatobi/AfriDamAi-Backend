import { Injectable } from '@nestjs/common';
import { ISpecialistRepository } from '../../../domain/repositories/specialist.repository.interface';
import { SpecialistEntity } from '../../../domain/entities/specialist.entity';
import { SpecialistMapper } from '../../mappers/specialist.mapper';
import { CreateSpecialistParams, UpdateSpecialistParams } from 'src/utils/type';
import { SpecialistStatus, SpecialistType } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class SpecialistRepository implements ISpecialistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SpecialistEntity | null> {
    const specialist = await this.prisma.specialist.findUnique({
      where: { id },
    });
    return specialist ? SpecialistMapper.toDomain(specialist) : null;
  }

  async findByEmail(email: string): Promise<SpecialistEntity | null> {
    const specialist = await this.prisma.specialist.findUnique({
      where: { email },
    });
    return specialist ? SpecialistMapper.toDomain(specialist) : null;
  }

  async findByType(type: SpecialistType): Promise<SpecialistEntity[]> {
    const specialists = await this.prisma.specialist.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
    return SpecialistMapper.toDomainArray(specialists);
  }

  async findByStatus(status: SpecialistStatus): Promise<SpecialistEntity[]> {
    const specialists = await this.prisma.specialist.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
    return SpecialistMapper.toDomainArray(specialists);
  }

  async findByOrganization(organizationId: string): Promise<SpecialistEntity[]> {
    const specialists = await this.prisma.specialist.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return SpecialistMapper.toDomainArray(specialists);
  }

  async findAll(): Promise<SpecialistEntity[]> {
    const specialists = await this.prisma.specialist.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return SpecialistMapper.toDomainArray(specialists);
  }

  async create(params: CreateSpecialistParams): Promise<SpecialistEntity> {
    const specialist = await this.prisma.specialist.create({
      data: {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phoneNo: params.phoneNo,
        sex: params.sex,
        documents: params.documents,
        status: params.status as SpecialistStatus ?? SpecialistStatus.PENDING,
        isActive: params.isActive ?? true,
        password: params.password,
        avatarUrl: params.avatarUrl, // Added avatarUrl
        organizationId: params.organizationId,
      },
    });
    return SpecialistMapper.toDomain(specialist);
  }

  async update(id: string, params: Partial<UpdateSpecialistParams>): Promise<SpecialistEntity> {
    const { status, documentsUrl, ...rest } = params;
    const dataToUpdate: any = {
      ...rest,
    };
    if (status !== undefined) {
      dataToUpdate.status = status as SpecialistStatus;
    }
    if (documentsUrl !== undefined) {
      dataToUpdate.documents = documentsUrl;
    }
    const specialist = await this.prisma.specialist.update({
      where: { id },
      data: dataToUpdate,
    });
    return SpecialistMapper.toDomain(specialist);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.specialist.delete({
      where: { id },
    });
  }
}
