import { ApiProperty } from '@nestjs/swagger';

export class VendorDocumentEntity {
  @ApiProperty() id: string;
  @ApiProperty() vendorId: string;

  // Business Info
  @ApiProperty({ required: false }) businessRegUrl?: string;
  @ApiProperty({ required: false }) taxIdNumber?: string;
  @ApiProperty({ required: false }) cacDocumentUrl?: string;
  @ApiProperty({ required: false }) directorName?: string;
  @ApiProperty({ required: false }) directorAddress?: string;

  // Bank Details
  @ApiProperty({ required: false }) bankName?: string;
  @ApiProperty({ required: false }) accountName?: string;
  @ApiProperty({ required: false }) accountNumber?: string;
  @ApiProperty({ required: false }) bankCode?: string;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor(partial: Partial<VendorDocumentEntity>) {
    Object.assign(this, partial);
  }
}
