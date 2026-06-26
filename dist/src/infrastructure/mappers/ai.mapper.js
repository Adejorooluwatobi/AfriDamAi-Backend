"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMapper = void 0;
class AiMapper {
    static toAiMoreInfo(user, profile) {
        return {
            region: user?.nationality || 'Unknown',
            country: user?.nationality || 'Unknown',
            known_skintone_type: profile?.skinToneLevel?.toString() || 'unknown',
            skin_type_last_time_checked: profile?.updatedAt?.toISOString() || new Date().toISOString(),
            known_skin_condition: 'none',
            skin_condition_last_time_checked: profile?.updatedAt?.toISOString() || new Date().toISOString(),
            gender: user?.sex || 'male',
            age: (profile?.ageRange && profile.ageRange > 0) ? profile.ageRange : 1,
            known_body_lotion: 'Unknown',
            known_body_lotion_brand: 'Unknown',
            known_allergies: profile?.knownSkinAllergies || [],
            known_last_skin_treatment: profile?.previousTreatment?.[0] || 'none',
            known_last_consultation_with_afridermatologists: 'none',
            user_activeness_on_app: 'moderate',
        };
    }
}
exports.AiMapper = AiMapper;
//# sourceMappingURL=ai.mapper.js.map