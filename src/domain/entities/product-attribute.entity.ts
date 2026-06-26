import { ApiProperty } from "@nestjs/swagger";

export class ProductAttributeEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    attributeId: string;

    @ApiProperty()
    attributeValueId: string;

    constructor(partial: Partial<ProductAttributeEntity>) {
        Object.assign(this, partial);
    }
}