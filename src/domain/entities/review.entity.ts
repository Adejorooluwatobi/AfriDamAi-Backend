import { ApiProperty } from '@nestjs/swagger';

export class ReviewEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    productId: string;

    @ApiProperty({ description: '1-5 stars' })
    rating: number;

    @ApiProperty({ required: false })
    comment?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<ReviewEntity>) {
        Object.assign(this, partial);
    }
}