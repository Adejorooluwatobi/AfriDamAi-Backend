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
exports.AssignSpecialistsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssignSpecialistsDto {
}
exports.AssignSpecialistsDto = AssignSpecialistsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of specialist IDs to assign to the appointment',
        type: [String],
        example: ['specialist_id_1', 'specialist_id_2']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one specialist must be assigned' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AssignSpecialistsDto.prototype, "specialistIds", void 0);
//# sourceMappingURL=assign-specialists.dto.js.map