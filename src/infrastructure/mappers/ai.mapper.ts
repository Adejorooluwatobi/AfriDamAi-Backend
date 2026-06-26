import { User, Profile } from '@prisma/client';
import { AiMoreInfo } from 'src/utils/type';

export class AiMapper {
  /**
   * Maps User and Profile data to the AiMoreInfo format required by the AI service.
   * This centralizes the logic for creating the user context object.
   */
  static toAiMoreInfo(user: User | null, profile: Profile | null): AiMoreInfo {
    return {
      region: user?.nationality || 'Unknown',
      country: user?.nationality || 'Unknown',
      known_skintone_type: profile?.skinToneLevel?.toString() || 'unknown',
      skin_type_last_time_checked: profile?.updatedAt?.toISOString() || new Date().toISOString(),
      known_skin_condition: 'none', // Not in schema, using placeholder
      skin_condition_last_time_checked: profile?.updatedAt?.toISOString() || new Date().toISOString(),
      gender: user?.sex || 'male',
      age: (profile?.ageRange && profile.ageRange > 0) ? profile.ageRange : 1, // 🛡️ FIX: age must be > 0
      known_body_lotion: 'Unknown', // Not in schema, using placeholder
      known_body_lotion_brand: 'Unknown', // Not in schema, using placeholder
      known_allergies: (profile?.knownSkinAllergies as string[]) || [],
      known_last_skin_treatment: (profile?.previousTreatment as string[])?.[0] || 'none',
      known_last_consultation_with_afridermatologists: 'none',
      user_activeness_on_app: 'moderate', // 🛡️ FIX: 'active' was invalid, using 'moderate' from UserContextDto enum
    };
  }
}
