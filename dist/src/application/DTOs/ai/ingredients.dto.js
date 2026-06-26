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
exports.IngredientsAnalysisResponseDto = exports.IngredientsAnalysisRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const chatbot_dto_1 = require("./chatbot.dto");
class IngredientsAnalysisRequestDto {
}
exports.IngredientsAnalysisRequestDto = IngredientsAnalysisRequestDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'Water, Glycerin, Cetyl Alcohol, Stearic Acid' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngredientsAnalysisRequestDto.prototype, "query", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: chatbot_dto_1.UserContextDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => chatbot_dto_1.UserContextDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", chatbot_dto_1.UserContextDto)
], IngredientsAnalysisRequestDto.prototype, "more_info", void 0);
class IngredientsAnalysisResponseDto {
}
exports.IngredientsAnalysisResponseDto = IngredientsAnalysisResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'success' }),
    __metadata("design:type", String)
], IngredientsAnalysisResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ example: 'The product contains safe ingredients...' }),
    __metadata("design:type", String)
], IngredientsAnalysisResponseDto.prototype, "response", void 0);
//# sourceMappingURL=ingredients.dto.js.map