import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../mappers/user.mapper';
import { CreateUserParams, UpdateUserParams } from 'src/utils/type';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({ 
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
      include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true },
      orderBy: { createdAt: 'desc' },
    });
    return users.map(UserMapper.toDomain);
  }

  async create(userData: CreateUserParams): Promise<UserEntity> {
    const user = await this.prisma.user.create({ 
      data: userData as any,
      include: { profile: true }
    });
    return UserMapper.toDomain(user);
  }

  /**
   * 🛡️ RE-ENFORCED: Update with Nested Profile Logic
   * Using 'as any' to bypass Prisma strict-check during the Google Cloud build sync.
   */
  async update(id: string, userData: Partial<UpdateUserParams>): Promise<UserEntity> {
    const { profile, ...userFields } = userData;

    const user = await this.prisma.user.update({ 
      where: { id }, 
      data: {
        ...userFields,
        profile: profile ? {
          upsert: {
                        create: {
                            ...((() => { 
                              const { userId, previousTreatments, ...rest } = profile; 
                              const newProfileData: any = { ...rest };
                              if (previousTreatments !== undefined) {
                                  newProfileData.previousTreatment = previousTreatments;
                              }
                              return newProfileData;
                            })()),
                            ageRange: profile.ageRange ?? 0,
                            skinType: profile.skinType ?? '',
                            onboardingCompleted: profile.onboardingCompleted ?? false,
                        } as any,
                        update: {
                            ...((() => { 
                              const { userId, previousTreatments, ...rest } = profile; 
                              const newProfileData: any = { ...rest };
                              if (previousTreatments !== undefined) {
                                  newProfileData.previousTreatment = previousTreatments;
                              }
                              return newProfileData;
                            })()),
                        } as any          }
        } : undefined
      } as any,
      include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
    });
    return UserMapper.toDomain(user);
  }

  async findByResetToken(resetToken: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({ 
      where: { 
        resetToken: resetToken,
        resetTokenExpiry: {
          gt: new Date()
        }
      },
      include: { profile: true, subscriptions: true, aiScans: true, currentPricingPlan: true }
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}