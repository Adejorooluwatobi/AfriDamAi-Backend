import { AttributeEntity } from "./attribute.entity";
import { ApiProperty } from "@nestjs/swagger";

export class AttributeValueEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    attributeId: string;

    @ApiProperty({ type: () => AttributeEntity })
    attribute: AttributeEntity;

    @ApiProperty({ description: 'e.g., "Large", "Blue", "Anti-Aging"' })
    value: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<AttributeValueEntity>) {
        Object.assign(this, partial);
    }
}