import { ShippingAddressEntity } from '../entities/shipping-address.entity';
import { CreateShippingAddressParams, UpdateShippingAddressParams } from 'src/utils/type';

export interface ShippingAddressRepositoryInterface {
    create(params: CreateShippingAddressParams): Promise<ShippingAddressEntity>;
    findById(id: string): Promise<ShippingAddressEntity | null>;
    findByUserId(userId: string): Promise<ShippingAddressEntity[]>;
    update(id: string, params: UpdateShippingAddressParams): Promise<ShippingAddressEntity>;
    delete(id: string): Promise<void>;
}