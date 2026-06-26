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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attribute_value_service_1 = require("../../domain/services/attribute-value.service");
const create_attribute_value_dto_1 = require("../../application/DTOs/attributes/create-attribute-value.dto");
const update_attribute_value_dto_1 = require("../../application/DTOs/attributes/update-attribute-value.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../auth/guards");
const atrribute_value_entity_1 = require("../../domain/entities/atrribute-value.entity");
let AttributeValueController = class AttributeValueController {
    constructor(attributeValueService) {
        this.attributeValueService = attributeValueService;
    }
    create(dto) {
        return this.attributeValueService.createAttributeValue(dto);
    }
    findAll() {
        return this.attributeValueService.findAllAttributeValues();
    }
    findByAttributeId(attributeId) {
        return this.attributeValueService.findByAttributeId(attributeId);
    }
    findOne(id) {
        return this.attributeValueService.findOneAttributeValue(id);
    }
    update(id, dto) {
        return this.attributeValueService.updateAttributeValue(id, dto);
    }
    remove(id) {
        return this.attributeValueService.deleteAttributeValue(id);
    }
};
exports.AttributeValueController = AttributeValueController;
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new attribute value' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attribute value created successfully', type: atrribute_value_entity_1.AttributeValueEntity }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Value already exists for this attribute' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attribute_value_dto_1.CreateAttributeValueDto]),
    __metadata("design:returntype", void 0)
], AttributeValueController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attribute values' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of attribute values' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: atrribute_value_entity_1.AttributeValueEntity }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttributeValueController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('attribute/:attributeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all values for an attribute' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: atrribute_value_entity_1.AttributeValueEntity }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('attributeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeValueController.prototype, "findByAttributeId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attribute value by ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: atrribute_value_entity_1.AttributeValueEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attribute value not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeValueController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an attribute value' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: atrribute_value_entity_1.AttributeValueEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attribute value not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Value already exists for this attribute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attribute_value_dto_1.UpdateAttributeValueDto]),
    __metadata("design:returntype", void 0)
], AttributeValueController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an attribute value' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Attribute value deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attribute value not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeValueController.prototype, "remove", null);
exports.AttributeValueController = AttributeValueController = __decorate([
    (0, swagger_1.ApiTags)('Attribute Values'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('attribute-values'),
    __metadata("design:paramtypes", [attribute_value_service_1.AttributeValueService])
], AttributeValueController);
//# sourceMappingURL=attribute-value.controller.js.map