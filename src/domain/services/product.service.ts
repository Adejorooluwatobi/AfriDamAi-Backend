import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdminNotificationService } from './admin-notification.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
import { VendorService } from './vendor.service';
import type { ProductRepositoryInterface } from '../repositories/product.repository.interface';
import { CreateProductParams, UpdateProductParams } from 'src/utils/type';
import { ProductEntity } from '../entities/product.entity';
import type { CategoryRepositoryInterface } from '../repositories/category.repository.interface';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepositoryInterface,
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly adminNotificationService: AdminNotificationService,
    private readonly mailService: MailService,
    private readonly vendorService: VendorService,
  ) {}

  private normalizeName(name: string): string {
    return name?.trim();
  }

  private ensureNameIsValid(name: string) {
    if (!name || !name.trim()) {
      throw new BadRequestException('Prod name must not be empty');
    }
  }

  private async generateUniqueSlug(
    name: string,
    excludeId?: string,
  ): Promise<string> {
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.productRepository.findBySlug(slug);
      if (!existing || (excludeId && existing.id === excludeId)) break;
      slug = `${baseSlug}-${counter++}`;
    }
    return slug;
  }

  async createProduct(
    productDetails: CreateProductParams,
  ): Promise<ProductEntity> {
    const name = this.normalizeName(productDetails.name);
    this.ensureNameIsValid(name);
    const slug = await this.generateUniqueSlug(name);
    //VAlidate primary category
    if (productDetails.primaryCategoryId) {
      const primaryCategory = await this.categoryRepository.findById(
        productDetails.primaryCategoryId,
      );
      if (!primaryCategory) {
        throw new BadRequestException(
          `Primary category ${productDetails.primaryCategoryId} does not exist`,
        );
      }
    }
    //validate secondary category
    if (
      productDetails.secondaryCategoryIds &&
      productDetails.secondaryCategoryIds.length
    ) {
      for (const categoryId of productDetails.secondaryCategoryIds) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
          throw new BadRequestException(
            `Secondary category ${categoryId} does not exist`,
          );
        }
      }
    }
    const newProduct = await this.productRepository.create({
      ...productDetails,
      name,
      slug,
      isActive: productDetails.isActive ?? true,
    });
    this.logger.log('Product created successfully', productDetails);
    this.logger.log('Product created successfully', newProduct.id);
    this.logger.log('Product created successfully', newProduct);

    // 📧 Notify Admins (Email disabled per user request)
    try {
        await this.adminNotificationService.notify(
          'SALES',
          'New Product Added',
          `<p>A new product has been added to the catalog.</p>
           <p><strong>Product:</strong> ${newProduct.name}</p>
           <p><strong>Price:</strong> ₦${newProduct.basePrice}</p>
           <p><strong>Vendor ID:</strong> ${newProduct.vendorId}</p>`,
           false // sendEmail = false
        );
    } catch (e) {
        this.logger.error('Failed to notify admins about new product', e);
    }

    return newProduct;
  }

  async findAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.findAll();
    return products;
  }

  async findOneProductById(id: string): Promise<ProductEntity | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async findOneProductBySlug(slug: string): Promise<ProductEntity | null> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  async findProductsByCategory(categoryId: string): Promise<ProductEntity[]> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with Id "${categoryId}" not found`);
    }
    return this.productRepository.findByCategory(categoryId);
  }

  async findProductsByVendor(vendorId: string): Promise<ProductEntity[]> {
    const vendor = await this.productRepository.findByVendor(vendorId);
    if (!vendor) {
      throw new NotFoundException(`Vendor with Id "${vendorId}" not found`);
    }
    return this.productRepository.findByVendor(vendorId);
  }

  async searchProducts(term: string): Promise<ProductEntity[]> {
    if (!term || !term.trim()) {
      throw new BadRequestException('Search term cannot be empty');
    }
    return this.productRepository.searchProducts(term);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.delete(id);
    this.logger.log('Product deleted successfully', product.id);

    // 📧 Notify Vendor
    try {
        const vendorData = await this.vendorService.findOneVendor(product.vendorId);
        if (vendorData && vendorData.vendor) {
            await this.mailService.sendProductDeletedEmail(
                vendorData.vendor.email,
                product.name,
                'Administative removal'
            );
        }
    } catch (e) {
        this.logger.error(`Failed to notify vendor on product deletion: ${id}`, e);
    }
  }

  async updateProduct(
    id: string,
    params: UpdateProductParams,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (params.name !== undefined) {
      const normalized = this.normalizeName(params.name);
      this.ensureNameIsValid(normalized);
      params.name = normalized;
    }

    // Validate categories if updated
    if (params.primaryCategoryId) {
      const primaryCategory = await this.categoryRepository.findById(
        params.primaryCategoryId,
      );
      if (!primaryCategory) {
        throw new BadRequestException(
          `Primary category ${params.primaryCategoryId} does not exist`,
        );
      }
    }

    if (params.secondaryCategoryIds?.length) {
      for (const categoryId of params.secondaryCategoryIds) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
          throw new BadRequestException(
            `Secondary category ${categoryId} does not exist`,
          );
        }
      }
    }

    const update = await this.productRepository.update(id, params);
    this.logger.log('Product updated successfully', update.id);
    return update;
  }
}
