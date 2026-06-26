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
exports.CreateAttributeDto = exports.AttributeType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var AttributeType;
(function (AttributeType) {
    AttributeType["TEXT"] = "text";
    AttributeType["SELECT"] = "select";
    AttributeType["COLOR"] = "color";
    AttributeType["NUMBER"] = "number";
    AttributeType["BOOLEAN"] = "boolean";
})(AttributeType || (exports.AttributeType = AttributeType = {}));
class CreateAttributeDto {
}
exports.CreateAttributeDto = CreateAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the attribute',
        example: 'Size'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the attribute',
        enum: AttributeType,
        example: AttributeType.SELECT
    }),
    (0, class_validator_1.IsEnum)(AttributeType),
    __metadata("design:type", String)
], CreateAttributeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this attribute is required for products',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAttributeDto.prototype, "isRequired", void 0);
//# sourceMappingURL=create-attribute.dto.js.map