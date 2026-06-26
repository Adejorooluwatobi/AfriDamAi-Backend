import { 
  Controller, Get, Post, Put, Body, Param, ValidationPipe, 
  ParseUUIDPipe, Delete, UseGuards, Request, NotFoundException, 
  InternalServerErrorException, UseInterceptors, UploadedFile,
  BadRequestException // 🛡️ OGA FIX: Added missing exception import
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiExtraModels, ApiOperation, ApiBearerAuth, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserService } from 'src/domain/services/user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/application/DTOs/users/create-user.dto';
import { UpdateUserDto } from 'src/application/DTOs/users/update-user.dto';
import { CartService } from 'src/domain/services/cart.service';
import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { AdminGuard } from '../auth/guards';
import { SecureUserResponseDto } from 'src/application/DTOs/response.dto';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';

@ApiExtraModels(CreateUserDto)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinical user' })
  @ApiResponse({ status: 201, type: SecureUserResponseDto })
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    // Ensure cart is created for new user
    await this.cartService.createCart(user.id);
    
    if(!user) {
      throw new InternalServerErrorException('Clinical user creation failed');
    }
    const secureUser = UserMapper.toSecureUserResponseDto(user);
    return {
      succeeded: true,
      message: 'User created successfully',
      resultData: secureUser
    };
  }

  // 🛡️ RE-ENFORCED: AVATAR UPLOAD ENDPOINT
  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload melanin-profile picture' })
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
  @UseInterceptors(FileInterceptor('file')) 
  async uploadAvatar(@Request() req: any, @UploadedFile() file: any) {
    const userInfo = this.extractUserId(req.user);
    
    if (!file) {
      throw new BadRequestException('No file detected in request');
    }

    // Pass the file to the service
    const user = await this.userService.updateUserAvatar(userInfo.id, file);
    
    return {
      succeeded: true,
      message: 'Avatar updated successfully',
      url: user.profile?.avatarUrl
    };
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 201, type: [SecureUserResponseDto] })
  async findAll() {
    const users = await this.userService.findAllUser();
    const secureUsers = users.map(user => UserMapper.toSecureUserResponseDto(user));
    return {
      succeeded: true,
      message: 'Users retrieved successfully',
      resultData: secureUsers
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current clinical info with profile' })
  async getMe(@Request() req: any) {
    const userInfo = this.extractUserId(req.user);
    const user = await this.userService.findOneUser(userInfo.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const secureUser = UserMapper.toSecureUserResponseDto(user);
    return {
      succeeded: true,
      message: 'User info retrieved successfully',
      resultData: secureUser
    };
  }

  private extractUserId(user: any): { id: string; type: string } {
    // 🛡️ RE-ENFORCED: Consistent ID extraction across tokens
    const id = user.user?.id || user.id || user.sub;
    if (id) return { id, type: 'user' };
    throw new NotFoundException('Clinical ID missing from session');
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update clinical profile and onboarding status' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`Clinical account ${id} not found`);
    }
    const secureUser = UserMapper.toSecureUserResponseDto(user);
    return {
      succeeded: true,
      message: 'Profile sync successful',
      resultData: secureUser
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOneUser(id);
    if (!user) throw new NotFoundException(`Account not found`);
    return {
      succeeded: true,
      resultData: UserMapper.toSecureUserResponseDto(user)
    };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove user (Admin Only)' })
  async delete(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { succeeded: true, message: 'Account purged successfully' };
  }

  @UseGuards(AdminGuard)
  @Put(':id/active-status')
  @ApiOperation({ summary: 'Enable/Disable user account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureUserResponseDto })
  async updateStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateAccountStatusDto) {
    const user = await this.userService.updateUserActiveStatus(id, statusDto.isActive);
    return {
      succeeded: true,
      message: `Account ${statusDto.isActive ? 'enabled' : 'disabled'} successfully`,
      resultData: UserMapper.toSecureUserResponseDto(user)
    };
  }

  @UseGuards(AdminGuard)
  @Put(':id/suspension-status')
  @ApiOperation({ summary: 'Suspend/Unsuspend user account (Admin Only)' })
  @ApiResponse({ status: 200, type: SecureUserResponseDto })
  async updateSuspensionStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusDto: UpdateSuspensionStatusDto) {
    const user = await this.userService.updateUserSuspensionStatus(id, statusDto.isSuspended);
    return {
      succeeded: true,
      message: `Account ${statusDto.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      resultData: UserMapper.toSecureUserResponseDto(user)
    };
  }
}