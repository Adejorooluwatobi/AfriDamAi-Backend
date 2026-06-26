import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductAttributeParams, UpdateProductAttributeParams} from 'src/utils/type';
import type { ProductAttributeRepositoryInterface } from '../repositories/product-attribute.repository.interface';
import { ProductAttributeEntity } from '../entities/product-attribute.entity';

@Injectable()
export class ProductAttributeService {
  private readonly logger = new Logger(ProductAttributeService.name);
  constructor(
    @Inject('ProductAttributeRepository')
    private readonly productAttributeRepository: ProductAttributeRepositoryInterface,
  ) {}


  async createProduct(
    params: CreateProductAttributeParams,
  ): Promise<ProductAttributeEntity> {

    const newProductAttr = await this.productAttributeRepository.create(params);
    this.logger.log('ProductAttr created successfully', newProductAttr.id);
    return newProductAttr;
  }

  async findById(id:string): Promise<ProductAttributeEntity | null> {
    const productsAttr = await this.productAttributeRepository.findById(id);
    return productsAttr;
  }

  async findByProductId(id: string): Promise<ProductAttributeEntity[]> {
    const productsAttr = await this.productAttributeRepository.findByProductId(id);
    if (!productsAttr) {
      throw new NotFoundException(`ProductAttribute with Productid ${id} not found`);
    }
    return productsAttr;
  }

  async delete(id: string): Promise<void> {
    const productAttr = await this.productAttributeRepository.findById(id);
    if (!productAttr) {
      throw new NotFoundException(`ProductAttribute with id ${id} not found`);
    }

    await this.productAttributeRepository.delete(id);
    this.logger.log('ProductAttribute updated successfully', productAttr.id);
  }


  async updateProduct(id:string,params:UpdateProductAttributeParams): Promise<ProductAttributeEntity>
  {
    const productAttr = await this.productAttributeRepository.findById(id);
    if (!productAttr) {
      throw new NotFoundException(`ProductAttribute with id ${id} not found`);
    }


    const update = await this.productAttributeRepository.update(
      id,
      params,
    );
    this.logger.log('ProductAttribute updated successfully', update.id);
    return update;

  }
}
