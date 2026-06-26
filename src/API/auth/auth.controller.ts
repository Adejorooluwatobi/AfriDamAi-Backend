import { Controller, Post, Body, HttpCode, HttpStatus, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminAccessTokenDto, SpecialistAccessTokenDto, UserAccessTokenDto, VendorAccessTokenDto } from './dto/access-token.dto';
import { AdminLoginDto, SpecialistLoginDto, UserLoginDto, VendorLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from 'src/application/DTOs/users/create-user.dto';
import { ForgotPasswordDto } from 'src/application/DTOs/users/forgot-password.dto';
import { ResetPasswordDto } from 'src/application/DTOs/users/reset-password.dto';
import { CreateVendorDto } from 'src/application/DTOs/vendor/create-vendor.dto';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';

import { VerifyRegistrationDto } from './dto/verify-registration.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  @ApiOperation({ summary: 'Register a new clinical user' })
  @ApiResponse({ status: 201, description: 'Verification code sent' })
  async registerUser(@Body() registerDto: CreateUserDto) {
    await this.authService.registerUser(registerDto);
    return {
      succeeded: true,
      message: 'A verification code has been sent to your email. Please verify to complete registration.',
    };
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  // ... (keeping userLogin as is)
  @ApiOperation({ summary: 'Secure Login' })
  async userLogin(@Body() loginDto: UserLoginDto): Promise<UserAccessTokenDto> {
    const token = await this.authService.loginUser(loginDto.email, loginDto.password);
    
    // 🛡️ RE-ENFORCED: Return full context for the frontend auth-provider
    return { 
      id: token.user?.id || '',
      accessToken: token.access_token, 
      refreshToken: token.refresh_token,
      isActive: token.user?.isActive || false, 
      displayName: `${token.user?.firstName || ''} ${token.user?.lastName || ''}`.trim(),
      role: token.user?.role || 'user',
      plan: token.user?.plan
    };
  }

  @Post('specialist/register')
  @ApiOperation({ summary: 'Register a new specialist' })
  @ApiResponse({ status: 201, description: 'Verification code sent' })
  async registerSpecialist(@Body() registerDto: CreateSpecialistDto) {
    await this.authService.registerSpecialist(registerDto);
    return {
      succeeded: true,
      message: 'A verification code has been sent to your email. Please verify to complete registration.',
    };
  }

  @Post('specialist/login')
  // ... (keeping specialistLogin as is)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Secure Login' })
  async specialistLogin(@Body() loginDto: SpecialistLoginDto): Promise<SpecialistAccessTokenDto> {
    const token = await this.authService.loginSpecialist(loginDto.email, loginDto.password);

    return {
      id: token.specialist?.id || '',
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      isActive: token.specialist?.isActive || false,
      displayName: `${token.specialist?.firstName || ''} ${token.specialist?.lastName || ''}`.trim(),
      role: token.specialist?.role || 'specialist',
      type: token.specialist?.type
    };
  }

  @Post('register/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email and complete registration' })
  @ApiResponse({ status: 200, description: 'Email verified and account created' })
  async verifyRegistration(@Body() verifyDto: VerifyRegistrationDto) {
    const result = await this.authService.completeRegistration(verifyDto.email, verifyDto.code);
    return {
      succeeded: true,
      message: 'Email verified and account created successfully.',
      resultData: result
    };
  }

  @Post('forgot-password')
  // ... (keeping forgotPassword as is)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    
    return {
      succeeded: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    };
  }

  @Post('reset-password')
  // ... (keeping resetPassword as is)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with clinical token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return {
      succeeded: true,
      message: 'Password updated successfully. You can now login.'
    };
  }

  @Delete('account')
  // ... (keeping deleteAccount as is)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete account - Dignity Zone' })
  async deleteAccount(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub;
    await this.authService.deleteAccount(userId);
    return {
      succeeded: true,
      message: 'Account deletion protocol initiated.'
    };
  }

  @Post('refresh')
  // ... (keeping refresh as is)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh clinical session' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // --- ADMIN & VENDOR ENDPOINTS ---
  @Post('admin/register')
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully', type: String })
  async registerAdmin(@Body() registerDto: CreateAdminDto): Promise<string> {
    await this.authService.registerAdmin(registerDto);
    return 'Admin registered successfully';
  }

  @Post('admin/login')
  // ... (keeping adminLogin as is)
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: AdminLoginDto): Promise<AdminAccessTokenDto> {
    const token = await this.authService.loginAdmin(loginDto.email, loginDto.password);
    return {
      id: token.admin?.id || '',
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      isActive: token.admin?.isActive || false,
      // 🛡️ OGA FIX: Field is 'username' in Admin schema, not 'name'
      displayName: token.admin?.username || '',
      role: token.admin?.role || 'admin',
      type: token.admin?.type
    };
  }

  @Post('vendor/register')
  @ApiOperation({ summary: 'Register a new vendor' })
  @ApiResponse({ status: 201, description: 'Verification code sent' })
  async registerVendor(@Body() registerDto: CreateVendorDto) {
    await this.authService.registerVendor(registerDto);
    return {
      succeeded: true,
      message: 'A verification code has been sent to your email. Please verify to complete registration.',
    };
  }

  @Post('vendor/login')
  @HttpCode(HttpStatus.OK)
  async vendorLogin(@Body() loginDto: VendorLoginDto): Promise<VendorAccessTokenDto> {
    const token = await this.authService.loginVendor(loginDto.email, loginDto.password);
    return {
      id: token.vendor?.id || '',
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      isActive: token.vendor?.isActive || false,
      // 🛡️ OGA FIX: Field is 'companyName' in Vendor schema, not 'name'
      displayName: token.vendor?.companyName || '' ,
      role: token.vendor?.role || 'vendor'
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user, admin, or vendor' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new BadRequestException('User ID or role not found in token.');
    }

    await this.authService.logout(userId, role);
    return {
      succeeded: true,
      message: 'Successfully logged out.'
    };
  }
}