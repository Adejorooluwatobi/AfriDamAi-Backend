import { Controller, Post, Body, UseGuards, Request, Get, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProfileDto } from 'src/application/DTOs/profiles/create-profile.dto';
import { UpdateProfileDto } from 'src/application/DTOs/profiles/update-profile.dto';
import { ProfileService } from 'src/domain/services/profile.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar uploaded successfully' })
  async uploadAvatar(@Request() req: any, @UploadedFile() file: any) {
    const avatarUrl = await this.fileUploadService.uploadImageFile(file);
    return this.profileService.updateProfile(req.user.id, { avatarUrl });
  }

  @Post()
  @ApiOperation({ summary: 'Create user profile (onboarding)' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  async createProfile(@Request() req: any, @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile({
      userId: req.user.id,
      ...createProfileDto
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Request() req: any) {
    return this.profileService.findByUserId(req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('skip-onboarding')
  @ApiOperation({ summary: 'Skip onboarding survey' })
  @ApiResponse({ status: 200, description: 'Onboarding skipped successfully' })
  async skipOnboarding(@Request() req: any) {
    return this.profileService.skipOnboarding(req.user.id);
  }
}