import { EmailVerification } from '@prisma/client';
import { EmailVerificationEntity } from '../../domain/entities/email-verification.entity';
export declare class EmailVerificationMapper {
    static toDomain(raw: EmailVerification): EmailVerificationEntity;
}
