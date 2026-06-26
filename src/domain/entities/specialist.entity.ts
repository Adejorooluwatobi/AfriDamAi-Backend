import { ApiProperty } from "@nestjs/swagger";
import { SpecialistStatus, SpecialistType } from "@prisma/client";

export class SpecialistEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNo: string;

    @ApiProperty({ required: false })
    nationality?: string;

    @ApiProperty()
    sex: string;

    @ApiProperty({ required: false })
    avatarUrl?: string; // Added avatarUrl

    @ApiProperty()
    password?: string;

     @ApiProperty({ required: false })
    refreshToken?: string;

    @ApiProperty({ required: false })
    resetToken?: string;

    @ApiProperty({ required: false })
    resetTokenExpiry?: Date;

    @ApiProperty({ required: false })
    lastLoginAt?: Date;

    @ApiProperty({ type: [String], required: false })
    documents?: string[];

    @ApiProperty({ enum: SpecialistStatus })
    status: SpecialistStatus;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuspended: boolean;

    @ApiProperty({ enum: SpecialistType })
    type: SpecialistType;

    @ApiProperty({ description: 'Number of completed appointments' })
    completedAppointments: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false })
    organizationId?: string;

    constructor(partial: Partial<SpecialistEntity>) {
        Object.assign(this, partial);
    }
}
