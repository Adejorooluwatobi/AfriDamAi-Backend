import { ApiProperty } from "@nestjs/swagger";

export class AttributeEntity {
    @ApiProperty()
    id: string;

    @ApiProperty({ description: 'e.g., "Size", "Color", "Skin Concern"' })
    name: string;

    @ApiProperty({ description: 'e.g., "select", "text", "number"' })
    type: string;

    @ApiProperty()
    isRequired: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<AttributeEntity>) {
        Object.assign(this, partial);
    }
}