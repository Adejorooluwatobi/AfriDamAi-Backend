import { UserEntity } from '../../domain/entities/user.entity';
import { User, Profile, UserSubscription, SubscriptionStatus, AI as Analyzer, PricingPlan } from '@prisma/client';
import { AnalyzerMapper } from './analyzer.mapper';
import { ProfileMapper } from './profile.mapper';
import { SecureUserResponseDto } from 'src/application/DTOs/response.dto';
import { SubscriptionMapper } from './subscription.mapper';
import { PricingPlanMapper } from './pricing-plan.mapper';


type UserWithRelations = User & {
  profile?: Profile | null;
  subscriptions?: UserSubscription[];
  aiScans?: Analyzer[];
  currentPricingPlan?: PricingPlan | null;
};

export class UserMapper {
  static toDomain(prismaUser: UserWithRelations): UserEntity {
    // Logic to determine the "user subscription status"
    // 1. Look for ACTIVE subscription
    // 2. If no ACTIVE, look for latest EXPIRED/CANCELLED/PENDING
    // 3. Else undefined
    let activeSubscription: UserSubscription | undefined;

    let totalRemainingSessions = 0;
    const activeSubscriptions: UserSubscription[] = [];

    if (prismaUser.subscriptions && prismaUser.subscriptions.length > 0) {
        // Sort by CreatedAt desc to get latest first
        const sortedSubs = [...prismaUser.subscriptions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        // Find all active ones and sum sessions
        for (const sub of sortedSubs) {
            if (sub.status === SubscriptionStatus.ACTIVE && (sub.endDate ? sub.endDate > new Date() : true)) {
                activeSubscriptions.push(sub);
                totalRemainingSessions += sub.remainingSessions || 0;
            }
        }

        // Filter out PENDING subscriptions older than 15 minutes, so they don't appear indefinitely
        const now = new Date();
        const validPastSubs = sortedSubs.filter(s => {
            if (s.status !== SubscriptionStatus.PENDING) return true;
            const ageInMinutes = (now.getTime() - s.createdAt.getTime()) / 60000;
            return ageInMinutes <= 15;
        });

        // Pick the latest active one for display, or just the latest valid one overall if no active
        activeSubscription = activeSubscriptions.length > 0 ? activeSubscriptions[0] : validPastSubs[0];
    }

    return new UserEntity({
      id: prismaUser.id,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      email: prismaUser.email,
      isActive: prismaUser.isActive,
      isSuspended: prismaUser.isSuspended,
      sex: prismaUser.sex,
      phoneNo: prismaUser.phoneNo,
      // 🛡️ RE-ENFORCED: Sync root onboarding status
      onboardingCompleted: prismaUser.onboardingCompleted,
      nationality: prismaUser.nationality ?? undefined,
      password: prismaUser.password ?? undefined,
      refreshToken: prismaUser.refreshToken ?? undefined,
      resetToken: prismaUser.resetToken ?? undefined,
      resetTokenExpiry: prismaUser.resetTokenExpiry ?? undefined,
      deletedAt: prismaUser.deletedAt ?? undefined,
      lastLoginAt: prismaUser.lastLoginAt ?? undefined,
      profile: prismaUser.profile 
        ? ProfileMapper.toDomain(prismaUser.profile) 
        : undefined,
      subscription: activeSubscription 
        ? SubscriptionMapper.toDomain(activeSubscription) 
        : undefined,
      plan: prismaUser.currentPricingPlan
        ? PricingPlanMapper.toDomain(prismaUser.currentPricingPlan)
        : undefined,
      analyzer: prismaUser.aiScans?.length 
        ? AnalyzerMapper.toDomain(
            [...prismaUser.aiScans].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
          )
        : undefined,
      analyzers: prismaUser.aiScans 
        ? AnalyzerMapper.toDomainArray(prismaUser.aiScans) 
        : [],
      // 🚀 NEW: Attach cumulative sessions to the domain entity
      totalRemainingSessions: activeSubscriptions.length > 0 ? totalRemainingSessions : undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  static toPersistence(user: UserEntity): Omit<User, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      sex: user.sex,
      currentPricingPlanId: user.plan?.id ?? null,
      phoneNo: user.phoneNo,
      // 🛡️ RE-ENFORCED: Move onboarding flag to DB
      onboardingCompleted: user.onboardingCompleted ?? false,
      nationality: user.nationality ?? null,
      password: user.password ?? null,
      isActive: user.isActive,
      isSuspended: user.isSuspended,
      refreshToken: user.refreshToken ?? null,
      resetToken: user.resetToken ?? null,
      resetTokenExpiry: user.resetTokenExpiry ?? null,
      deletedAt: user.deletedAt ?? null,
      lastLoginAt: user.lastLoginAt ?? null,
    };
  }

  static toSecureUserResponseDto(user: UserEntity): SecureUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: user.sex,
      phoneNo: user.phoneNo,
      isActive: user.isActive,
      isSuspended: user.isSuspended,
      lastLoginAt: user.lastLoginAt ?? null,
      // 🛡️ RE-ENFORCED: Ensure frontend gets the onboarding status
      onboardingCompleted: user.onboardingCompleted ?? false,
      profile: user.profile ? user.profile : null,
      // analyzer: user.analyzer ? user.analyzer : null,
      analyzers: user.analyzers ? user.analyzers : null,
      // 🛡️ RE-ENFORCED: Return actual subscription with CUMULATIVE sessions
      subscription: user.subscription ? {
        ...user.subscription,
        remainingSessions: user.totalRemainingSessions ?? user.subscription.remainingSessions
      } : null,
      plan: user.plan ? user.plan : {
        id: 'default-free',
        name: 'Free Tier',
        type: 'FREE',
        price: 0,
        description: ['Basic access'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}