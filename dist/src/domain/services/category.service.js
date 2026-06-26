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
var CategoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = require("../../utils/slugify");
let CategoryService = CategoryService_1 = class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.logger = new common_1.Logger(CategoryService_1.name);
        this.MAX_DEPTH = 3;
    }
    async generateUniqueSlug(name, parentId) {
        const base = (0, slugify_1.slugify)(name);
        let slug = base;
        let counter = 1;
        while (true) {
            const existing = await this.categoryRepository.findBySlugInParent(slug, parentId ?? null);
            if (!existing)
                return slug;
            counter++;
            slug = `${base}-${counter}`;
            if (counter > 1000)
                throw new common_1.ConflictException('Unable to generate unique slug');
        }
    }
    async validateDepth(parentId) {
        if (!parentId)
            return;
        let depth = 1;
        let currentParentId = parentId;
        while (currentParentId) {
            const parent = await this.categoryRepository.findById(currentParentId);
            if (!parent)
                throw new common_1.BadRequestException(`Parent category ${currentParentId} does not exist`);
            if (depth > this.MAX_DEPTH) {
                throw new common_1.BadRequestException(`Max category depth of ${this.MAX_DEPTH} exceeded`);
            }
            depth++;
            currentParentId = parent.parentId ?? null;
        }
    }
    async ensureNoCycle(candidateParentId, candidateId) {
        if (!candidateParentId || !candidateId)
            return;
        let currentParentId = candidateParentId;
        while (currentParentId) {
            if (currentParentId === candidateId) {
                throw new common_1.BadRequestException('Cycle detected in category parent assignment');
            }
            const parent = await this.categoryRepository.findById(currentParentId);
            if (!parent)
                break;
            currentParentId = parent.parentId ?? null;
        }
    }
    async createCategory(params) {
        const name = params.name?.trim();
        if (!name)
            throw new common_1.BadRequestException('Name is required');
        await this.validateDepth(params.parentId ?? null);
        const existingName = await this.categoryRepository.findByNameInParent(name, params.parentId ?? null);
        if (existingName) {
            throw new common_1.ConflictException(`Category name "${name}" already exists under the same parent.`);
        }
        const slug = await this.generateUniqueSlug(name, params.parentId ?? null);
        const payload = {
            name,
            slug,
            description: params.description ?? null,
            parentId: params.parentId ?? null,
            isActive: params.isActive ?? true,
        };
        const created = await this.categoryRepository.create(payload);
        this.logger.log(`Category created (id=${created.id}, slug=${created.slug})`);
        return created;
    }
    async findAllCategories() {
        const categories = await this.categoryRepository.findAll();
        const categoryMap = new Map(categories.map((c) => [c.id, c]));
        return categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            parentId: cat.parentId,
            parentName: cat.parentId
                ? (categoryMap.get(cat.parentId)?.name ?? null)
                : null,
            createdAt: cat.createdAt,
        }));
    }
    async findOneCategoryById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        }
        let parentName;
        if (category.parentId) {
            const parent = await this.categoryRepository.findById(category.parentId);
            parentName = parent?.name ?? null;
        }
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            parentId: category.parentId,
            parentName,
            createdAt: category.createdAt
        };
    }
    async updateCategory(id, update) {
        const existing = await this.categoryRepository.findById(id);
        if (!existing)
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        if (!update || Object.keys(update).length === 0) {
            throw new common_1.BadRequestException('No fields provided for update');
        }
        if (update.parentId !== undefined) {
            await this.ensureNoCycle(update.parentId ?? null, id);
            await this.validateDepth(update.parentId ?? null);
        }
        if (update.name !== undefined) {
            const normalized = update.name.trim();
            if (!normalized)
                throw new common_1.BadRequestException('Category name cannot be empty');
            const parentIdToCheck = update.parentId !== undefined
                ? (update.parentId ?? null)
                : (existing.parentId ?? null);
            const other = await this.categoryRepository.findByNameInParent(normalized, parentIdToCheck);
            if (other && other.id !== id) {
                throw new common_1.ConflictException(`Category name "${normalized}" already exists under the same parent.`);
            }
            update.name = normalized;
        }
        const updated = await this.categoryRepository.update(id, update);
        this.logger.log(`Category updated (id=${updated.id})`);
        return updated;
    }
    async deleteCategory(id) {
        const existing = await this.categoryRepository.findById(id);
        if (!existing)
            throw new common_1.NotFoundException(`Category with id ${id} not found`);
        const all = await this.categoryRepository.findAllRaw();
        const hasChildren = all.some((c) => c.parentId === id);
        if (hasChildren) {
            throw new common_1.BadRequestException('Cannot delete category with child categories. Remove or reassign children first.');
        }
        await this.categoryRepository.delete(id);
        this.logger.log(`Category deleted (id=${id})`);
    }
    async getCategoryTree() {
        const rows = await this.categoryRepository.findAllRaw();
        const map = new Map();
        rows.forEach((r) => {
            map.set(r.id, { ...r, children: [] });
        });
        const roots = [];
        rows.forEach((r) => {
            const node = map.get(r.id);
            if (!node)
                return;
            if (r.parentId) {
                const parentNode = map.get(r.parentId);
                if (parentNode) {
                    parentNode.children.push(node);
                }
                else {
                    roots.push(node);
                }
            }
            else {
                roots.push(node);
            }
        });
        return roots;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = CategoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CategoryRepository')),
    __metadata("design:paramtypes", [Object])
], CategoryService);
//# sourceMappingURL=category.service.js.map