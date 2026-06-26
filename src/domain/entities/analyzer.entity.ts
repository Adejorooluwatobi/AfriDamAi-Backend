import { ApiProperty } from '@nestjs/swagger';

export class AnalyzerEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    imageUrl: string;

    @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
    predictions: Record<string, number>;

    @ApiProperty()
    description: string;

    @ApiProperty()
    status: string;

    @ApiProperty({ required: false })
    label?: string;

    @ApiProperty({ required: false })
    aiImageUrl?: string;

    @ApiProperty()
    createdAt: Date;

    constructor(partial: Partial<AnalyzerEntity>) {
        Object.assign(this, partial);
    }
}

