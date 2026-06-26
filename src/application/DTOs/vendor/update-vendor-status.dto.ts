import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VendorStatus } from 'src/domain/entities/vendor.entity';

export class UpdateVendorStatusDto {
  @ApiProperty({ enum: VendorStatus })
  @IsNotEmpty()
  @IsEnum(VendorStatus)
  status: VendorStatus;
}
