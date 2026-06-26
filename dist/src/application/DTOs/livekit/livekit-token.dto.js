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
exports.LiveKitTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LiveKitTokenDto {
}
exports.LiveKitTokenDto = LiveKitTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'room-123', description: 'The unique name of the room' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LiveKitTokenDto.prototype, "room", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-456', description: 'The unique identity of the participant' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LiveKitTokenDto.prototype, "identity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '{"role": "admin"}', description: 'Optional metadata for the participant', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LiveKitTokenDto.prototype, "metadata", void 0);
//# sourceMappingURL=livekit-token.dto.js.map