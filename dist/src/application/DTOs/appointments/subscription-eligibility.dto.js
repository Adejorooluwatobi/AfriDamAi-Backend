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
exports.SubscriptionEligibilityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SubscriptionEligibilityDto {
}
exports.SubscriptionEligibilityDto = SubscriptionEligibilityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the user is eligible to book an appointment' }),
    __metadata("design:type", Boolean)
], SubscriptionEligibilityDto.prototype, "eligible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for ineligibility if applicable', required: false }),
    __metadata("design:type", String)
], SubscriptionEligibilityDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Days remaining in subscription', required: false }),
    __metadata("design:type", Number)
], SubscriptionEligibilityDto.prototype, "daysRemaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remaining appointment slots', required: false }),
    __metadata("design:type", Number)
], SubscriptionEligibilityDto.prototype, "remainingSessions", void 0);
//# sourceMappingURL=subscription-eligibility.dto.js.map