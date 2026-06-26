import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { AttributeValueEntity } from '../entities/atrribute-value.entity';
import {
  CreateAttributeValueParams,
  UpdateAttributeValueParams,
} from 'src/utils/type';
import type { AttributeValueRepositoryInterface } from '../repositories/attribute-value.repository.interface';
import type { AttributeRepositoryInterface } from '../repositories/attribute.repository.interface';

@Injectable()
export class AttributeValueService {
  constructor(
    @Inject('IAttributeValueRepository')
    private readonly attributeValueRepository: AttributeValueRepositoryInterface,
    @Inject('IAttributeRepository')
    private readonly attributeRepository: AttributeRepositoryInterface,
  ) {}

  async createAttributeValue(
    valueDetails: CreateAttributeValueParams,
  ): Promise<AttributeValueEntity> {
    const { attributeId, value } = valueDetails;

    // 1. Ensure parent Attribute exists
    const attribute = await this.attributeRepository.findById(attributeId);
    if (!attribute) {
      throw new NotFoundException(`Attribute with id ${attributeId} not found`);
    }

    // 2. Optional: check duplicate (attributeId, value) before DB unique error
    const existingValues =
      await this.attributeValueRepository.findByAttributeId(attributeId);
    const duplicate = existingValues.find(
      (v) => v.value.toLowerCase() === value.toLowerCase(),
    );

    if (duplicate) {
      throw new ConflictException(
        `Value "${value}" already exists for this attribute`,
      );
    }

    // 3. Create AttributeValue
    return this.attributeValueRepository.create(valueDetails);
  }

//   async findAllAttributeValues(): Promise<AttributeValueEntity[]> {
//     return this.attributeValueRepository.findAll();
//   }

  async findAllAttributeValues(): Promise<AttributeValueEntity[]> {
    return this.attributeValueRepository.findAll();
  }

  async findOneAttributeValue(id: string): Promise<AttributeValueEntity> {
    const attributeValue = await this.attributeValueRepository.findById(id);
    if (!attributeValue) {
      throw new NotFoundException(
        `AttributeValue with id ${id} not found`,
      );
    }
    return attributeValue;
  }

  async findByAttributeId(
    attributeId: string,
  ): Promise<AttributeValueEntity[]> {
    return this.attributeValueRepository.findByAttributeId(attributeId);
  }

  async updateAttributeValue(
    id: string,
    updateDetails: UpdateAttributeValueParams,
  ): Promise<AttributeValueEntity> {
    const existing = await this.attributeValueRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `AttributeValue with id ${id} not found`,
      );
    }

    // if updating value, check for duplicate per attribute
    if (updateDetails.value) {
      const values = await this.attributeValueRepository.findByAttributeId(
        existing.attributeId,
      );
      const duplicate = values.find(
        (v) =>
          v.value.toLowerCase() === updateDetails.value!.toLowerCase() &&
          v.id !== id,
      );
      if (duplicate) {
        throw new ConflictException(
          `Value "${updateDetails.value}" already exists for this attribute`,
        );
      }
    }

    return this.attributeValueRepository.update(id, updateDetails);
  }

  async deleteAttributeValue(id: string): Promise<void> {
    const existing = await this.attributeValueRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(
        `AttributeValue with id ${id} not found`,
      );
    }

    await this.attributeValueRepository.delete(id);
  }
}
