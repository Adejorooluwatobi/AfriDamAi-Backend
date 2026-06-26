export declare enum AttributeType {
    TEXT = "text",
    SELECT = "select",
    COLOR = "color",
    NUMBER = "number",
    BOOLEAN = "boolean"
}
export declare class CreateAttributeDto {
    name: string;
    type: AttributeType;
    isRequired?: boolean;
}
