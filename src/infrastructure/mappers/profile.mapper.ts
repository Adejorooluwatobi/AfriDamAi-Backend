import { Profile } from '@prisma/client';
import { ProfileEntity } from '../../domain/entities/profile.entity';

export class ProfileMapper {
  static toDomain(prismaProfile: Profile): ProfileEntity {
    return new ProfileEntity({
      id: prismaProfile.id,
      userId: prismaProfile.userId ?? '',
      ageRange: prismaProfile.ageRange ?? undefined,
      skinType: prismaProfile.skinType ?? undefined,
      // 🛡️ RE-ENFORCED: Melanin-Specific Fields
      melaninTone: prismaProfile.melaninTone ?? undefined,
      primaryConcern: prismaProfile.primaryConcern ?? undefined,
      environment: prismaProfile.environment ?? undefined,
      avatarUrl: prismaProfile.avatarUrl ?? undefined,
      // 🛡️ RE-ENFORCED: Onboarding Status
      onboardingCompleted: prismaProfile.onboardingCompleted,
      
      skinToneLevel: prismaProfile.skinToneLevel ?? undefined,
      knownSkinAllergies: prismaProfile.knownSkinAllergies,
      allergies: prismaProfile.allergies ?? undefined,
      previousTreatments: prismaProfile.previousTreatment,
      onboardingSkipped: prismaProfile.onboardingSkipped,
      createdAt: prismaProfile.createdAt,
      updatedAt: prismaProfile.updatedAt,
    });
  }

  static toDomainArray(prismaProfiles: Profile[]): ProfileEntity[] {
    return prismaProfiles.map(profile => this.toDomain(profile));
  }

  static toPersistence(profile: ProfileEntity): Omit<Profile, 'createdAt' | 'updatedAt'> {
    return {
      id: profile.id,
      userId: profile.userId ?? null,
      ageRange: profile.ageRange ?? null,
      skinType: profile.skinType ?? null,
      // 🛡️ SYNCED: Moving data back to Prisma
      melaninTone: profile.melaninTone ?? null,
      primaryConcern: profile.primaryConcern ?? null,
      environment: profile.environment ?? null,
      avatarUrl: profile.avatarUrl ?? null,
      onboardingCompleted: profile.onboardingCompleted ?? false,
      
      skinToneLevel: profile.skinToneLevel ?? null,
      knownSkinAllergies: profile.knownSkinAllergies ?? [],
      allergies: profile.allergies ?? null,
      previousTreatment: profile.previousTreatments ?? [],
      onboardingSkipped: profile.onboardingSkipped ?? false,
    };
  }
}