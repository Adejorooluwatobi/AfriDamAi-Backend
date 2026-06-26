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
exports.SpecialistAssignmentEntity = exports.SpecialistAssignmentStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
var SpecialistAssignmentStatus;
(function (SpecialistAssignmentStatus) {
    SpecialistAssignmentStatus["PENDING"] = "PENDING";
    SpecialistAssignmentStatus["ACCEPTED"] = "ACCEPTED";
    SpecialistAssignmentStatus["DECLINED"] = "DECLINED";
    SpecialistAssignmentStatus["CANCELLED"] = "CANCELLED";
})(SpecialistAssignmentStatus || (exports.SpecialistAssignmentStatus = SpecialistAssignmentStatus = {}));
class SpecialistAssignmentEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.SpecialistAssignmentEntity = SpecialistAssignmentEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SpecialistAssignmentEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SpecialistAssignmentEntity.prototype, "appointmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SpecialistAssignmentEntity.prototype, "specialistId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SpecialistAssignmentEntity.prototype, "assignedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SpecialistAssignmentStatus }),
    __metadata("design:type", String)
], SpecialistAssignmentEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SpecialistAssignmentEntity.prototype, "assignedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], SpecialistAssignmentEntity.prototype, "respondedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SpecialistAssignmentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SpecialistAssignmentEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], SpecialistAssignmentEntity.prototype, "appointment", void 0);
//# sourceMappingURL=specialist-assignment.entity.js.map