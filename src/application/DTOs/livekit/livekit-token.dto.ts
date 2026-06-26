import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LiveKitTokenDto {
  @ApiProperty({ example: 'room-123', description: 'The unique name of the room' })
  @IsString()
  @IsNotEmpty()
  room: string;

  @ApiProperty({ example: 'user-456', description: 'The unique identity of the participant' })
  @IsString()
  @IsNotEmpty()
  identity: string;

  @ApiProperty({ example: '{"role": "admin"}', description: 'Optional metadata for the participant', required: false })
  @IsString()
  @IsOptional()
  metadata?: string;
}
