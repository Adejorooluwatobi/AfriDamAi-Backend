import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { AttributeEntity } from '../entities/attribute.entity';
import { CreateAttributeParams, UpdateAttributeParams } from 'src/utils/type';
import type { AttributeRepositoryInterface } from '../repositories/attribute.repository.interface';

@Injectable()
export class AttributeService {
  constructor(
    @Inject('IAttributeRepository')
    private readonly attributeRepository: AttributeRepositoryInterface,
  ) {}

  async createAttribute(
    attributeDetails: CreateAttributeParams,
  ): Promise<AttributeEntity> {
    // Basic validation – bad request, not "not found"
    if (!attributeDetails.name || !attributeDetails.type) {
      throw new BadRequestException('Name and type are required');
    }

    // Check if attribute with the same name already exists
    const attributes = await this.attributeRepository.findAll();
    const existingAttribute = attributes.find(
      (attr) =>
        attr.name.toLowerCase() === attributeDetails.name.toLowerCase(),
    );

    if (existingAttribute) {
      throw new ConflictException(
        `Attribute with name ${attributeDetails.name} already exists`,
      );
    }

    const newAttribute = await this.attributeRepository.create({
      ...attributeDetails,
      isRequired: attributeDetails.isRequired ?? false,
    });

    return newAttribute;
  }

  async findAllAttributes(): Promise<AttributeEntity[]> {
    return this.attributeRepository.findAll();
  }

  async findOneAttribute(id: string): Promise<AttributeEntity> {
    const attribute = await this.attributeRepository.findById(id);
    if (!attribute) {
      throw new NotFoundException(`Attribute with id ${id} not found`);
    }
    return attribute;
  }

  async updateAttribute(
    id: string,
    updateAttributeDetails: UpdateAttributeParams,
  ): Promise<AttributeEntity> {
    const existingAttribute = await this.attributeRepository.findById(id);
    if (!existingAttribute) {
      throw new NotFoundException(`Attribute with id ${id} not found`);
    }

    // Check for duplicate name if name is being updated
    if (updateAttributeDetails.name) {
      const attributes = await this.attributeRepository.findAll();
      const duplicateAttribute = attributes.find(
        (attr) =>
          attr.name.toLowerCase() ===
            updateAttributeDetails.name!.toLowerCase() && attr.id !== id,
      );

      if (duplicateAttribute) {
        throw new ConflictException(
          `Attribute with name ${updateAttributeDetails.name} already exists`,
        );
      }
    }

    const updatedAttribute = await this.attributeRepository.update(
      id,
      updateAttributeDetails,
    );
    return updatedAttribute;
  }

  async deleteAttribute(id: string): Promise<void> {
    const attribute = await this.attributeRepository.findById(id);
    if (!attribute) {
      throw new NotFoundException(`Attribute with id ${id} not found`);
    }

    await this.attributeRepository.delete(id);
  }
}
