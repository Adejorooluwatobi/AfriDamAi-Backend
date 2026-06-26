import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  participant1Id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  participant2Id: string;
}

export class CreateChatMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty({ required: false })
  @IsString()
  message?: string;

  @ApiProperty({ required: false })
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  attachmentUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  mimeType?: string;

  @ApiProperty({ required: false })
  fileSize?: number;

  @ApiProperty({ required: false })
  duration?: number;
}
