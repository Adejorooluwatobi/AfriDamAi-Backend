import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { CategoryRepositoryInterface } from '../repositories/category.repository.interface';
import { CreateCategoryParams, UpdateCategoryParams } from 'src/utils/type';
import { CategoryEntity } from '../entities/category.entity';
import { slugify } from 'src/utils/slugify';
import { CategoryResponseDto } from 'src/application/DTOs/categories/response-category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  private readonly MAX_DEPTH = 3;
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  // Creates slug and ensures uniqueness inside parent (appends -2, -3 when needed)
  private async generateUniqueSlug(
    name: string,
    parentId: string | null,
  ): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let counter = 1;
    while (true) {
      const existing = await this.categoryRepository.findBySlugInParent(
        slug,
        parentId ?? null,
      );
      if (!existing) return slug;
      counter++;
      slug = `${base}-${counter}`;
      // safety guard
      if (counter > 1000)
        throw new ConflictException('Unable to generate unique slug');
    }
  }

  // Validate depth by walking up parents
  private async validateDepth(parentId: string | null) {
    if (!parentId) return;
    let depth = 1;
    let currentParentId: string | null = parentId;
    while (currentParentId) {
      const parent = await this.categoryRepository.findById(currentParentId);
      if (!parent)
        throw new BadRequestException(
          `Parent category ${currentParentId} does not exist`,
        );
      // detect cycles
      if (depth > this.MAX_DEPTH) {
        throw new BadRequestException(
          `Max category depth of ${this.MAX_DEPTH} exceeded`,
        );
      }
      depth++;
      currentParentId = parent.parentId ?? null;
    }
  }

  // Detect cycles when setting parent: ensure target parent isn't a child of this node
  private async ensureNoCycle(
    candidateParentId: string | null,
    candidateId?: string,
  ) {
    if (!candidateParentId || !candidateId) return;
    // walk up from candidateParentId and ensure we don't encounter candidateId
    let currentParentId: string | null = candidateParentId;
    while (currentParentId) {
      if (currentParentId === candidateId) {
        throw new BadRequestException(
          'Cycle detected in category parent assignment',
        );
      }
      const parent = await this.categoryRepository.findById(currentParentId);
      if (!parent) break;
      currentParentId = parent.parentId ?? null;
    }
  }

  // CREATE
  async createCategory(params: CreateCategoryParams): Promise<CategoryEntity> {
    const name = params.name?.trim();
    if (!name) throw new BadRequestException('Name is required');

    // depth validation
    await this.validateDepth(params.parentId ?? null);

    // uniqueness by name within parent
    const existingName = await this.categoryRepository.findByNameInParent(
      name,
      params.parentId ?? null,
    );
    if (existingName) {
      throw new ConflictException(
        `Category name "${name}" already exists under the same parent.`,
      );
    }

    // generate slug (immutable)
    const slug = await this.generateUniqueSlug(name, params.parentId ?? null);

    const payload: CreateCategoryParams = {
      name,
      slug,
      description: params.description ?? null,
      parentId: params.parentId ?? null,
      isActive: params.isActive ?? true,
    };

    const created = await this.categoryRepository.create(payload);
    this.logger.log(
      `Category created (id=${created.id}, slug=${created.slug})`,
    );
    return created;
  }

  async findAllCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description:cat.description,
      parentId: cat.parentId,
      parentName: cat.parentId
        ? (categoryMap.get(cat.parentId)?.name ?? null)
        : null,
        createdAt:cat.createdAt,
    }));
  }

  async findOneCategoryById(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
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
      createdAt:category.createdAt
    };
  }

  async updateCategory(
    id: string,
    update: UpdateCategoryParams,
  ): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing)
      throw new NotFoundException(`Category with id ${id} not found`);

    if (!update || Object.keys(update).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }

    // if parent is being changed -> validate depth and cycles
    if (update.parentId !== undefined) {
      await this.ensureNoCycle(update.parentId ?? null, id);
      await this.validateDepth(update.parentId ?? null);
    }

    // if name is being changed -> ensure uniqueness within parent (existing.parentId unless update.parentId set)
    if (update.name !== undefined) {
      const normalized = update.name.trim();
      if (!normalized)
        throw new BadRequestException('Category name cannot be empty');
      const parentIdToCheck =
        update.parentId !== undefined
          ? (update.parentId ?? null)
          : (existing.parentId ?? null);
      const other = await this.categoryRepository.findByNameInParent(
        normalized,
        parentIdToCheck,
      );
      if (other && other.id !== id) {
        throw new ConflictException(
          `Category name "${normalized}" already exists under the same parent.`,
        );
      }
      update.name = normalized;
    }

    // Important: do NOT regenerate slug on name change (slug is permanent)

    const updated = await this.categoryRepository.update(id, update);
    this.logger.log(`Category updated (id=${updated.id})`);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing)
      throw new NotFoundException(`Category with id ${id} not found`);

    // Optional: prevent deleting if has children. I'll prevent by default:
    const all = await this.categoryRepository.findAllRaw();
    const hasChildren = all.some((c) => c.parentId === id);
    if (hasChildren) {
      throw new BadRequestException(
        'Cannot delete category with child categories. Remove or reassign children first.',
      );
    }

    await this.categoryRepository.delete(id);
    this.logger.log(`Category deleted (id=${id})`);
  }

  // Build nested tree
  async getCategoryTree(): Promise<CategoryEntity[]> {
    const rows = await this.categoryRepository.findAllRaw();

    // map by id with children
    const map = new Map<
      string,
      CategoryEntity & { children: CategoryEntity[] }
    >();
    rows.forEach((r) => {
      map.set(r.id, { ...r, children: [] });
    });

    const roots: (CategoryEntity & { children: CategoryEntity[] })[] = [];

    rows.forEach((r) => {
      const node = map.get(r.id);
      if (!node) return; // safety guard

      if (r.parentId) {
        const parentNode = map.get(r.parentId);
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          roots.push(node); // orphaned, treat as root
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
