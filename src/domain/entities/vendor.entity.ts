import { ApiProperty } from "@nestjs/swagger";

export enum VendorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    SUSPENDED = 'SUSPENDED',
    REJECTED = 'REJECTED'
}

export class VendorEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    companyName: string;

    @ApiProperty()
    rcNumber: string;

    @ApiProperty()
    businessAddress: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty({ required: false })
    documentsUrl?: string[];

    @ApiProperty({ enum: VendorStatus, default: VendorStatus.PENDING })
    status: VendorStatus;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty({ required: false })
    password?: string;

    @ApiProperty({ required: false })
    refreshToken?: string;

    @ApiProperty({ required: false })
    resetToken?: string;

    @ApiProperty({ required: false })
    resetTokenExpiry?: Date;

    @ApiProperty({ required: false })
    lastLoginAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<VendorEntity>) {
        Object.assign(this, partial);
    }
}
