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
exports.AttributeValueService = void 0;
const common_1 = require("@nestjs/common");
let AttributeValueService = class AttributeValueService {
    constructor(attributeValueRepository, attributeRepository) {
        this.attributeValueRepository = attributeValueRepository;
        this.attributeRepository = attributeRepository;
    }
    async createAttributeValue(valueDetails) {
        const { attributeId, value } = valueDetails;
        const attribute = await this.attributeRepository.findById(attributeId);
        if (!attribute) {
            throw new common_1.NotFoundException(`Attribute with id ${attributeId} not found`);
        }
        const existingValues = await this.attributeValueRepository.findByAttributeId(attributeId);
        const duplicate = existingValues.find((v) => v.value.toLowerCase() === value.toLowerCase());
        if (duplicate) {
            throw new common_1.ConflictException(`Value "${value}" already exists for this attribute`);
        }
        return this.attributeValueRepository.create(valueDetails);
    }
    async findAllAttributeValues() {
        return this.attributeValueRepository.findAll();
    }
    async findOneAttributeValue(id) {
        const attributeValue = await this.attributeValueRepository.findById(id);
        if (!attributeValue) {
            throw new common_1.NotFoundException(`AttributeValue with id ${id} not found`);
        }
        return attributeValue;
    }
    async findByAttributeId(attributeId) {
        return this.attributeValueRepository.findByAttributeId(attributeId);
    }
    async updateAttributeValue(id, updateDetails) {
        const existing = await this.attributeValueRepository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`AttributeValue with id ${id} not found`);
        }
        if (updateDetails.value) {
            const values = await this.attributeValueRepository.findByAttributeId(existing.attributeId);
            const duplicate = values.find((v) => v.value.toLowerCase() === updateDetails.value.toLowerCase() &&
                v.id !== id);
            if (duplicate) {
                throw new common_1.ConflictException(`Value "${updateDetails.value}" already exists for this attribute`);
            }
        }
        return this.attributeValueRepository.update(id, updateDetails);
    }
    async deleteAttributeValue(id) {
        const existing = await this.attributeValueRepository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`AttributeValue with id ${id} not found`);
        }
        await this.attributeValueRepository.delete(id);
    }
};
exports.AttributeValueService = AttributeValueService;
exports.AttributeValueService = AttributeValueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAttributeValueRepository')),
    __param(1, (0, common_1.Inject)('IAttributeRepository')),
    __metadata("design:paramtypes", [Object, Object])
], AttributeValueService);
//# sourceMappingURL=attribute-value.service.js.map