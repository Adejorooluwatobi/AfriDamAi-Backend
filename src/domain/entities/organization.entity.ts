import { ApiProperty } from "@nestjs/swagger";
import { OrganizationStatus } from "@prisma/client";

export class OrganizationEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  logoUrl?: string;

  @ApiProperty({ required: false })
  brandingColors?: any; // Json in Prisma

  @ApiProperty({ required: false })
  licenseUrl?: string;

  @ApiProperty({ required: false })
  licenseNumber?: string;

  @ApiProperty({ enum: OrganizationStatus })
  status: OrganizationStatus;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<OrganizationEntity>) {
    Object.assign(this, partial);
  }
}
