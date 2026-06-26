"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEntity = void 0;
const analyzer_entity_1 = require("./analyzer.entity");
const swagger_1 = require("@nestjs/swagger");
class ProfileEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ProfileEntity = ProfileEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], ProfileEntity.prototype, "ageRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [analyzer_entity_1.AnalyzerEntity], required: false }),
    __metadata("design:type", Array)
], ProfileEntity.prototype, "skinHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "skinType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "melaninTone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "primaryConcern", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "environment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], ProfileEntity.prototype, "onboardingCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Boolean)
], ProfileEntity.prototype, "hasCompletedOnboarding", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Fitzpatrick scale (1-6)' }),
    __metadata("design:type", Number)
], ProfileEntity.prototype, "skinToneLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], ProfileEntity.prototype, "knownSkinAllergies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileEntity.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    __metadata("design:type", Array)
], ProfileEntity.prototype, "previousTreatments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Whether user skipped onboarding' }),
    __metadata("design:type", Boolean)
], ProfileEntity.prototype, "onboardingSkipped", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProfileEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ProfileEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=profile.entity.js.map