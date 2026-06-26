import { VendorEntity } from '../../domain/entities/vendor.entity';
import { Vendor } from '@prisma/client';
import { SecureVendorResponseDto } from 'src/application/DTOs/response.dto';
import { Wallet } from 'src/domain/entities/wallet.entity';
export declare class VendorMapper {
    static toDomain(raw: Vendor): VendorEntity;
    static toDomainArray(raws: Vendor[]): VendorEntity[];
    static toPersistence(domain: VendorEntity): Omit<Vendor, 'createdAt' | 'updatedAt' | 'id'>;
    static toSecureResponse(data: {
        vendor: VendorEntity;
        wallet: Wallet | null;
    }): SecureVendorResponseDto;
}
