import { SecureSpecialistResponseDto } from 'src/application/DTOs/response.dto';
import { SpecialistEntity } from '../../domain/entities/specialist.entity';
import { Specialist } from '@prisma/client';
import { Wallet } from 'src/domain/entities/wallet.entity';
export declare class SpecialistMapper {
    static toDomain(raw: Specialist): SpecialistEntity;
    static toDomainArray(raws: Specialist[]): SpecialistEntity[];
    static toPersistence(domain: SpecialistEntity): Specialist;
    static toSecureSpecialistResponseDto(data: {
        specialist: SpecialistEntity;
        wallet: Wallet | null;
    }): SecureSpecialistResponseDto;
}
