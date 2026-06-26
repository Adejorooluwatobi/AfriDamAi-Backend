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
exports.AttributeService = void 0;
const common_1 = require("@nestjs/common");
let AttributeService = class AttributeService {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async createAttribute(attributeDetails) {
        if (!attributeDetails.name || !attributeDetails.type) {
            throw new common_1.BadRequestException('Name and type are required');
        }
        const attributes = await this.attributeRepository.findAll();
        const existingAttribute = attributes.find((attr) => attr.name.toLowerCase() === attributeDetails.name.toLowerCase());
        if (existingAttribute) {
            throw new common_1.ConflictException(`Attribute with name ${attributeDetails.name} already exists`);
        }
        const newAttribute = await this.attributeRepository.create({
            ...attributeDetails,
            isRequired: attributeDetails.isRequired ?? false,
        });
        return newAttribute;
    }
    async findAllAttributes() {
        return this.attributeRepository.findAll();
    }
    async findOneAttribute(id) {
        const attribute = await this.attributeRepository.findById(id);
        if (!attribute) {
            throw new common_1.NotFoundException(`Attribute with id ${id} not found`);
        }
        return attribute;
    }
    async updateAttribute(id, updateAttributeDetails) {
        const existingAttribute = await this.attributeRepository.findById(id);
        if (!existingAttribute) {
            throw new common_1.NotFoundException(`Attribute with id ${id} not found`);
        }
        if (updateAttributeDetails.name) {
            const attributes = await this.attributeRepository.findAll();
            const duplicateAttribute = attributes.find((attr) => attr.name.toLowerCase() ===
                updateAttributeDetails.name.toLowerCase() && attr.id !== id);
            if (duplicateAttribute) {
                throw new common_1.ConflictException(`Attribute with name ${updateAttributeDetails.name} already exists`);
            }
        }
        const updatedAttribute = await this.attributeRepository.update(id, updateAttributeDetails);
        return updatedAttribute;
    }
    async deleteAttribute(id) {
        const attribute = await this.attributeRepository.findById(id);
        if (!attribute) {
            throw new common_1.NotFoundException(`Attribute with id ${id} not found`);
        }
        await this.attributeRepository.delete(id);
    }
};
exports.AttributeService = AttributeService;
exports.AttributeService = AttributeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IAttributeRepository')),
    __metadata("design:paramtypes", [Object])
], AttributeService);
//# sourceMappingURL=attribute.service.js.map