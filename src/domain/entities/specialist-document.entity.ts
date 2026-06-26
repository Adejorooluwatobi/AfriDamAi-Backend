import { ApiProperty } from '@nestjs/swagger';

export class SpecialistDocumentEntity {
  @ApiProperty() id: string;
  @ApiProperty() specialistId: string;

  // Personal Info
  @ApiProperty({ required: false }) personalAddress?: string;
  @ApiProperty({ required: false }) city?: string;
  @ApiProperty({ required: false }) state?: string;
  @ApiProperty({ required: false }) country?: string;

  // Professional Info
  @ApiProperty({ required: false }) licenseNumber?: string;
  @ApiProperty({ required: false }) licenseUrl?: string;
  @ApiProperty({ required: false }) yearsExperience?: number;
  @ApiProperty({ required: false }) specialization?: string;

  // Bank Details
  @ApiProperty({ required: false }) bankName?: string;
  @ApiProperty({ required: false }) accountName?: string;
  @ApiProperty({ required: false }) accountNumber?: string;
  @ApiProperty({ required: false }) bankCode?: string;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor(partial: Partial<SpecialistDocumentEntity>) {
    Object.assign(this, partial);
  }
}
