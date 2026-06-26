import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IEmailVerificationRepository } from '../../../domain/repositories/email-verification.repository.interface';
import { EmailVerificationEntity } from '../../../domain/entities/email-verification.entity';
import { EmailVerificationMapper } from '../../mappers/email-verification.mapper';
import { CreateEmailVerificationParams, UpdateEmailVerificationParams } from 'src/utils/type';

@Injectable()
export class PrismaEmailVerificationRepository implements IEmailVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<EmailVerificationEntity | null> {
    const verification = await this.prisma.emailVerification.findUnique({
      where: { email },
    });
    return verification ? EmailVerificationMapper.toDomain(verification) : null;
  }

  async create(data: CreateEmailVerificationParams): Promise<EmailVerificationEntity> {
    const verification = await this.prisma.emailVerification.create({
      data: data as any,
    });
    return EmailVerificationMapper.toDomain(verification);
  }

  async update(email: string, data: UpdateEmailVerificationParams): Promise<EmailVerificationEntity> {
    const verification = await this.prisma.emailVerification.update({
      where: { email },
      data: data as any,
    });
    return EmailVerificationMapper.toDomain(verification);
  }

  async upsert(email: string, data: CreateEmailVerificationParams): Promise<EmailVerificationEntity> {
    const verification = await this.prisma.emailVerification.upsert({
      where: { email },
      update: data as any,
      create: data as any,
    });
    return EmailVerificationMapper.toDomain(verification);
  }

  async delete(email: string): Promise<void> {
    await this.prisma.emailVerification.delete({
      where: { email },
    });
  }
}
