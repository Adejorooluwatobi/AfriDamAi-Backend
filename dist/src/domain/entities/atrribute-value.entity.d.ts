import { AttributeEntity } from "./attribute.entity";
export declare class AttributeValueEntity {
    id: string;
    attributeId: string;
    attribute: AttributeEntity;
    value: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<AttributeValueEntity>);
}
