import { Injectable } from '@nestjs/common';
import { ShippingAddressRepositoryInterface } from 'src/domain/repositories/shipping-address.repository.interface';
import { ShippingAddressEntity } from 'src/domain/entities/shipping-address.entity';
import { CreateShippingAddressParams, UpdateShippingAddressParams } from 'src/utils/type';
import { PrismaService } from './prisma.service';
import { ShippingAddressMapper } from 'src/infrastructure/mappers/shipping-address.mapper';

@Injectable()
export class PrismaShippingAddressRepository implements ShippingAddressRepositoryInterface {
    constructor(private prisma: PrismaService) {}

    async create(params: CreateShippingAddressParams): Promise<ShippingAddressEntity> {
        const address = await this.prisma.shippingAddress.create({
            data: params,
        });
        return ShippingAddressMapper.toDomain(address);
    }

    async findById(id: string): Promise<ShippingAddressEntity | null> {
        const address = await this.prisma.shippingAddress.findUnique({
            where: { id },
        });
        return address ? ShippingAddressMapper.toDomain(address) : null;
    }

    async findByUserId(userId: string): Promise<ShippingAddressEntity[]> {
        const addresses = await this.prisma.shippingAddress.findMany({
            where: { userId },
        });
        return addresses.map(ShippingAddressMapper.toDomain);
    }

    async update(id: string, params: UpdateShippingAddressParams): Promise<ShippingAddressEntity> {
        const address = await this.prisma.shippingAddress.update({
            where: { id },
            data: params,
        });
        return ShippingAddressMapper.toDomain(address);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.shippingAddress.delete({
            where: { id },
        });
    }
}