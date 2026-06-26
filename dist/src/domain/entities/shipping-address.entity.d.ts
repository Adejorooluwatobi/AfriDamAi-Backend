export declare class ShippingAddressEntity {
    id: string;
    userId: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ShippingAddressEntity>);
}
