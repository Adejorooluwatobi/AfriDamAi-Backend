import { EmailVerificationEntity } from '../entities/email-verification.entity';
import { CreateEmailVerificationParams, UpdateEmailVerificationParams } from 'src/utils/type';

export interface IEmailVerificationRepository {
  findByEmail(email: string): Promise<EmailVerificationEntity | null>;
  create(data: CreateEmailVerificationParams): Promise<EmailVerificationEntity>;
  update(email: string, data: UpdateEmailVerificationParams): Promise<EmailVerificationEntity>;
  upsert(email: string, data: CreateEmailVerificationParams): Promise<EmailVerificationEntity>;
  delete(email: string): Promise<void>;
}
