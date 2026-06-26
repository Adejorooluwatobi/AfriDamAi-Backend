import { ApiProperty } from "@nestjs/swagger";

export class NotificationEntity {
    @ApiProperty()
    id: string;

    @ApiProperty({ required: false })
    userId?: string;

    @ApiProperty({ required: false })
    adminId?: string;

    @ApiProperty({ required: false })
    vendorId?: string;

    @ApiProperty({ required: false })
    specialistId?: string;

    @ApiProperty()
    isGeneral: boolean;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    isDelivered: boolean;

    @ApiProperty({ required: false })
    readAt?: Date;

    @ApiProperty({ required: false })
    deliveredAt?: Date;

    @ApiProperty()
    createdAt: Date;

    constructor(partial: Partial<NotificationEntity>) {
        Object.assign(this, partial);
    }
}
