import { AdminNotificationService } from './admin-notification.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
import { VendorService } from './vendor.service';
import type { ProductRepositoryInterface } from '../repositories/product.repository.interface';
import { CreateProductParams, UpdateProductParams } from 'src/utils/type';
import { ProductEntity } from '../entities/product.entity';
import type { CategoryRepositoryInterface } from '../repositories/category.repository.interface';
export declare class ProductService {
    private readonly productRepository;
    private readonly categoryRepository;
    private readonly adminNotificationService;
    private readonly mailService;
    private readonly vendorService;
    private readonly logger;
    constructor(productRepository: ProductRepositoryInterface, categoryRepository: CategoryRepositoryInterface, adminNotificationService: AdminNotificationService, mailService: MailService, vendorService: VendorService);
    private normalizeName;
    private ensureNameIsValid;
    private generateUniqueSlug;
    createProduct(productDetails: CreateProductParams): Promise<ProductEntity>;
    findAllProducts(): Promise<ProductEntity[]>;
    findOneProductById(id: string): Promise<ProductEntity | null>;
    findOneProductBySlug(slug: string): Promise<ProductEntity | null>;
    findProductsByCategory(categoryId: string): Promise<ProductEntity[]>;
    findProductsByVendor(vendorId: string): Promise<ProductEntity[]>;
    searchProducts(term: string): Promise<ProductEntity[]>;
    deleteProduct(id: string): Promise<void>;
    updateProduct(id: string, params: UpdateProductParams): Promise<ProductEntity>;
}
