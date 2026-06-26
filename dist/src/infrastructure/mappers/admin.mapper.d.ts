import { AdminEntity } from '../../domain/entities/admin.entity';
import { Admin } from '@prisma/client';
import { SecureAdminResponseDto } from 'src/application/DTOs/response.dto';
export declare class AdminMapper {
    static toDomain(raw: Admin): AdminEntity;
    static toDomainArray(raws: Admin[]): AdminEntity[];
    static toPersistence(domain: AdminEntity): Omit<Admin, 'createdAt' | 'updatedAt' | 'id'>;
    static toSecureResponse(entity: AdminEntity): SecureAdminResponseDto;
}
