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
exports.AttributeValueEntity = void 0;
const attribute_entity_1 = require("./attribute.entity");
const swagger_1 = require("@nestjs/swagger");
class AttributeValueEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.AttributeValueEntity = AttributeValueEntity;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AttributeValueEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AttributeValueEntity.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => attribute_entity_1.AttributeEntity }),
    __metadata("design:type", attribute_entity_1.AttributeEntity)
], AttributeValueEntity.prototype, "attribute", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'e.g., "Large", "Blue", "Anti-Aging"' }),
    __metadata("design:type", String)
], AttributeValueEntity.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AttributeValueEntity.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], AttributeValueEntity.prototype, "updatedAt", void 0);
//# sourceMappingURL=atrribute-value.entity.js.map