import { ApiProperty } from "@nestjs/swagger";

export class ShippingAddressEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    isDefault: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<ShippingAddressEntity>) {
        Object.assign(this, partial);
    }
}