import { VendorEntity, VendorStatus } from '../../domain/entities/vendor.entity';
import { Vendor } from '@prisma/client';
import { SecureVendorResponseDto } from 'src/application/DTOs/response.dto';
import { Wallet } from 'src/domain/entities/wallet.entity'; // Import Wallet

export class VendorMapper {
  static toDomain(raw: Vendor): VendorEntity {
    return new VendorEntity({
      id: raw.id,
      companyName: raw.companyName,
      rcNumber: raw.rcNumber,
      businessAddress: raw.businessAddress,
      phoneNumber: raw.phoneNumber,
      email: raw.email,
      documentsUrl: raw.documentsUrl ?? [],
      status: raw.status as VendorStatus,
      isActive: raw.isActive,
      isSuspended: raw.isSuspended,
      password: raw.password ?? undefined,
      refreshToken: raw.refreshToken ?? undefined,
      resetToken: raw.resetToken ?? undefined,
      resetTokenExpiry: raw.resetTokenExpiry ?? undefined,
      lastLoginAt: raw.lastLoginAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toDomainArray(raws: Vendor[]): VendorEntity[] {
    return raws.map(vendor => this.toDomain(vendor));
  }

  static toPersistence(domain: VendorEntity): Omit<Vendor, 'createdAt' | 'updatedAt' | 'id'> {
    return {
      email: domain.email,
      companyName: domain.companyName,
      rcNumber: domain.rcNumber,
      businessAddress: domain.businessAddress,
      phoneNumber: domain.phoneNumber,
      documentsUrl: domain.documentsUrl ?? [],
      status: domain.status,
      password: domain.password || null,
      isActive: domain.isActive,
      isSuspended: domain.isSuspended,
      refreshToken: domain.refreshToken ?? null,
      resetToken: domain.resetToken ?? null,
      resetTokenExpiry: domain.resetTokenExpiry ?? null,
      lastLoginAt: domain.lastLoginAt ?? null,
    };
  }

  static toSecureResponse(data: { vendor: VendorEntity; wallet: Wallet | null }): SecureVendorResponseDto {
    const { vendor, wallet } = data;
    return {
      id: vendor.id,
      companyName: vendor.companyName,
      rcNumber: vendor.rcNumber,
      businessAddress: vendor.businessAddress,
      phoneNumber: vendor.phoneNumber,
      email: vendor.email,
      documentsUrl: vendor.documentsUrl,
      status: vendor.status,
      isActive: vendor.isActive,
      isSuspended: vendor.isSuspended,
      lastLoginAt: vendor.lastLoginAt ?? null,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
      wallet: wallet,
    };
  }
}