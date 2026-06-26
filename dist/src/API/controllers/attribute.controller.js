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
exports.AttributeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attribute_service_1 = require("../../domain/services/attribute.service");
const create_attribute_dto_1 = require("../../application/DTOs/attributes/create-attribute.dto");
const update_attribute_dto_1 = require("../../application/DTOs/attributes/update-attribute.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../auth/guards");
const attribute_entity_1 = require("../../domain/entities/attribute.entity");
let AttributeController = class AttributeController {
    constructor(attributeService) {
        this.attributeService = attributeService;
    }
    create(dto) {
        return this.attributeService.createAttribute({
            name: dto.name,
            type: dto.type,
            isRequired: dto.isRequired ?? false,
        });
    }
    findAll() {
        return this.attributeService.findAllAttributes();
    }
    findOne(id) {
        return this.attributeService.findOneAttribute(id);
    }
    update(id, dto) {
        return this.attributeService.updateAttribute(id, dto);
    }
    remove(id) {
        return this.attributeService.deleteAttribute(id);
    }
};
exports.AttributeController = AttributeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new attribute' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attribute created successfully', type: attribute_entity_1.AttributeEntity }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attribute_dto_1.CreateAttributeDto]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attributes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all attributes', type: [attribute_entity_1.AttributeEntity] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attribute by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute found', type: attribute_entity_1.AttributeEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attribute not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an attribute' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attribute updated successfully', type: attribute_entity_1.AttributeEntity }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attribute not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attribute_dto_1.UpdateAttributeDto]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an attribute' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Attribute deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attribute not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributeController.prototype, "remove", null);
exports.AttributeController = AttributeController = __decorate([
    (0, swagger_1.ApiTags)('Attributes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('attributes'),
    __metadata("design:paramtypes", [attribute_service_1.AttributeService])
], AttributeController);
//# sourceMappingURL=attribute.controller.js.map