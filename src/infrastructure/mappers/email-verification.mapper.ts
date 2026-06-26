import { EmailVerification } from '@prisma/client';
import { EmailVerificationEntity } from '../../domain/entities/email-verification.entity';

export class EmailVerificationMapper {
  static toDomain(raw: EmailVerification): EmailVerificationEntity {
    return new EmailVerificationEntity({
      id: raw.id,
      email: raw.email,
      code: raw.code,
      payload: raw.payload,
      role: raw.role,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    });
  }
}
