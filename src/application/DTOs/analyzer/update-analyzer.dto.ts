import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateAnalyzerDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imageUrl: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    predictions?: Record<string, number>;

    @ApiProperty()
    @IsString()
    @IsOptional()
    discription?: string;
}