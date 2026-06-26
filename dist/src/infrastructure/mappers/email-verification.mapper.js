"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationMapper = void 0;
const email_verification_entity_1 = require("../../domain/entities/email-verification.entity");
class EmailVerificationMapper {
    static toDomain(raw) {
        return new email_verification_entity_1.EmailVerificationEntity({
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
exports.EmailVerificationMapper = EmailVerificationMapper;
//# sourceMappingURL=email-verification.mapper.js.map