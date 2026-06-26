import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpsertVendorDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessRegUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taxIdNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cacDocumentUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  directorName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  directorAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankCode?: string;
}
