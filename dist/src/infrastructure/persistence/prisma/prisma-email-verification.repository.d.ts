import { PrismaService } from './prisma.service';
import { IEmailVerificationRepository } from '../../../domain/repositories/email-verification.repository.interface';
import { EmailVerificationEntity } from '../../../domain/entities/email-verification.entity';
import { CreateEmailVerificationParams, UpdateEmailVerificationParams } from 'src/utils/type';
export declare class PrismaEmailVerificationRepository implements IEmailVerificationRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<EmailVerificationEntity | null>;
    create(data: CreateEmailVerificationParams): Promise<EmailVerificationEntity>;
    update(email: string, data: UpdateEmailVerificationParams): Promise<EmailVerificationEntity>;
    upsert(email: string, data: CreateEmailVerificationParams): Promise<EmailVerificationEntity>;
    delete(email: string): Promise<void>;
}
