import { SecureSpecialistResponseDto } from 'src/application/DTOs/response.dto';
import { SpecialistEntity } from '../../domain/entities/specialist.entity';
import { Specialist } from '@prisma/client';
import { Wallet } from 'src/domain/entities/wallet.entity'; // Import Wallet

export class SpecialistMapper {
  static toDomain(raw: Specialist): SpecialistEntity {
    return new SpecialistEntity({
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phoneNo: raw.phoneNo,
      sex: raw.sex,
      avatarUrl: raw.avatarUrl ?? undefined, // Added avatarUrl
      password: raw.password ?? undefined,
      documents: raw.documents ?? [],
      status: raw.status,
      type: raw.type,
      isActive: raw.isActive,
      isSuspended: raw.isSuspended,
      completedAppointments: raw.completedAppointments,
      refreshToken: raw.refreshToken ?? undefined,
      resetToken: raw.resetToken ?? undefined,
      resetTokenExpiry: raw.resetTokenExpiry ?? undefined,
      lastLoginAt: raw.lastLoginAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      organizationId: raw.organizationId ?? undefined,
    });
  }

  static toDomainArray(raws: Specialist[]): SpecialistEntity[] {
    return raws.map(s => this.toDomain(s));
  }

  static toPersistence(domain: SpecialistEntity): Specialist {
    return {
      id: domain.id,
      firstName: domain.firstName,
      lastName: domain.lastName,
      email: domain.email,
      phoneNo: domain.phoneNo,
      sex: domain.sex,
      avatarUrl: domain.avatarUrl ?? null, // Added avatarUrl
      password: domain.password ?? null,
      documents: domain.documents ?? [],
      status: domain.status,
      type: domain.type,
      isActive: domain.isActive,
      isSuspended: domain.isSuspended,
      completedAppointments: domain.completedAppointments,
      refreshToken: domain.refreshToken ?? null,
      resetToken: domain.resetToken ?? null,
      resetTokenExpiry: domain.resetTokenExpiry ?? null,
      lastLoginAt: domain.lastLoginAt ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      organizationId: domain.organizationId ?? null,
    };
  }

  static toSecureSpecialistResponseDto(data: { specialist: SpecialistEntity; wallet: Wallet | null }): SecureSpecialistResponseDto {
    const { specialist, wallet } = data;
    return {
      id: specialist.id,
      email: specialist.email,
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      sex: specialist.sex,
      avatarUrl: specialist.avatarUrl,
      documents: specialist.documents,
      type: specialist.type,
      status: specialist.status,
      phoneNo: specialist.phoneNo,
      isActive: specialist.isActive,
      isSuspended: specialist.isSuspended,
      lastLoginAt: specialist.lastLoginAt ?? null,
      completedAppointments: specialist.completedAppointments,
      createdAt: specialist.createdAt,
      updatedAt: specialist.updatedAt,
      organizationId: specialist.organizationId,
      wallet: wallet,
    };
  }
}
