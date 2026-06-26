"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileMapper = void 0;
const profile_entity_1 = require("../../domain/entities/profile.entity");
class ProfileMapper {
    static toDomain(prismaProfile) {
        return new profile_entity_1.ProfileEntity({
            id: prismaProfile.id,
            userId: prismaProfile.userId ?? '',
            ageRange: prismaProfile.ageRange ?? undefined,
            skinType: prismaProfile.skinType ?? undefined,
            melaninTone: prismaProfile.melaninTone ?? undefined,
            primaryConcern: prismaProfile.primaryConcern ?? undefined,
            environment: prismaProfile.environment ?? undefined,
            avatarUrl: prismaProfile.avatarUrl ?? undefined,
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
    static toDomainArray(prismaProfiles) {
        return prismaProfiles.map(profile => this.toDomain(profile));
    }
    static toPersistence(profile) {
        return {
            id: profile.id,
            userId: profile.userId ?? null,
            ageRange: profile.ageRange ?? null,
            skinType: profile.skinType ?? null,
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
exports.ProfileMapper = ProfileMapper;
//# sourceMappingURL=profile.mapper.js.map