import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateVendorDto } from 'src/application/DTOs/vendor/create-vendor.dto';
import { AdminService } from 'src/domain/services/admin.service';
import { UserService } from 'src/domain/services/user.service';
import { VendorService } from 'src/domain/services/vendor.service';
import { MailService } from '../../infrastructure/messaging/mail/mail.service'; 
import { CreateUserDto } from 'src/application/DTOs/users/create-user.dto';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { VendorStatus } from 'src/domain/entities/vendor.entity';
import { SpecialistService } from 'src/domain/services/specialist.service';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { PrismaEmailVerificationRepository } from 'src/infrastructure/persistence/prisma/prisma-email-verification.repository';
import { AdminNotificationService } from 'src/domain/services/admin-notification.service';

// 🛡️ RE-ENFORCED INTERFACE: Synced with Prisma Schema 'onboardingCompleted'
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: { 
    id: string; 
    isAdmin: boolean; 
    isActive: boolean; 
    firstName: string; 
    lastName: string; 
    role: string;
    onboardingCompleted: boolean; 
    plan?: any;
  };
  admin?: { 
    id: string; 
    isAdmin: boolean; 
    isActive: boolean; 
    username: string; 
    role: string;
    type: any; 
  };
  vendor?: { 
    id: string; 
    isVendor: boolean; 
    isActive: boolean; 
    companyName: string; 
    role: string 
  };
  specialist?: {
    id: string;
    isSpecialist: boolean; 
    isActive: boolean; 
    firstName: string; 
    lastName: string;
    role: string;
    type: any; 
  }
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private adminService: AdminService,
    private vendorService: VendorService,
    private specialistService: SpecialistService,
    private mailService: MailService, 
    private emailVerificationRepo: PrismaEmailVerificationRepository,
    private adminNotificationService: AdminNotificationService,
  ) {
    this.jwtSecret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // 🚀 REFACTORED: Now initiates email verification instead of direct registration
  async registerUser(registerDto: CreateUserDto): Promise<void> {
    await this.initiateRegistration(registerDto.email, registerDto, 'USER');
  }

  async registerVendor(registerDto: CreateVendorDto): Promise<void> {
    await this.initiateRegistration(registerDto.email, registerDto, 'VENDOR');
  }

  async registerSpecialist(registerDto: CreateSpecialistDto): Promise<void> {
    await this.initiateRegistration(registerDto.email, registerDto, 'SPECIALIST');
  }

  private async initiateRegistration(email: string, payload: any, role: string): Promise<void> {
    // 1. Check if email already exists in main tables
    let existing: any = null;
    if (role === 'USER') existing = await this.userService.findByEmail(email);
    else if (role === 'VENDOR') existing = await this.vendorService.findByEmail(email);
    else if (role === 'SPECIALIST') existing = await this.specialistService.findByEmail(email).catch(() => null);

    if (existing) {
      throw new ConflictException(`Account with email ${email} already exists`);
    }

    // 2. Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Upsert into EmailVerification table using Repo
    await this.emailVerificationRepo.upsert(email, {
      email,
      code,
      payload,
      role,
      expiresAt,
    });

    // 4. Send email
    await this.mailService.sendVerificationCodeEmail(email, code);
    this.logger.log(`Registration verification code sent to ${email} for role ${role}`);
  }

  /**
   * ✅ NEW: Completes the registration after email verification
   */
  async completeRegistration(email: string, code: string): Promise<AuthResponse> {
    const verification = await this.emailVerificationRepo.findByEmail(email);

    if (!verification) {
      throw new BadRequestException('No pending registration found for this email');
    }

    if (verification.code !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    const payload = verification.payload as any;
    let registeredUser: any = null;

    // Create the actual account based on role
    if (verification.role === 'USER') {
      registeredUser = await this.userService.createUser({
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNo: payload.phoneNo,
        sex: payload.sex,
        nationality: payload.nationality,
        isActive: true,
      });
      this.mailService.sendWelcomeEmail(payload.email, payload.firstName, 'User');
    } else if (verification.role === 'VENDOR') {
      registeredUser = await this.vendorService.createVendor({
        email: payload.email,
        password: payload.password,
        companyName: payload.companyName,
        rcNumber: payload.rcNumber,
        businessAddress: payload.businessAddress,
        phoneNumber: payload.phoneNumber,
        documentsUrl: payload.documentsUrl,
        status: VendorStatus.PENDING,
        isActive: true,
      });
      this.mailService.sendWelcomeEmail(payload.email, payload.companyName, 'Vendor');
    } else if (verification.role === 'SPECIALIST') {
      registeredUser = await this.specialistService.createSpecialist({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        phoneNo: payload.phoneNo,
        sex: payload.sex,
        documents: payload.documents || [],
        type: payload.type,
      });
      this.mailService.sendWelcomeEmail(payload.email, payload.firstName, 'Specialist');
    }

    // 📧 Notify Admins
    await this.adminNotificationService.notify(
      'ACCOUNT',
      'New Account Registered',
      `<p>A new <strong>${verification.role}</strong> account has been created and verified.</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Name:</strong> ${payload.firstName || payload.companyName || 'N/A'}</p>`
    );

    // Delete verification record
    await this.emailVerificationRepo.delete(email);

    // Automatically login after verification
    const roleLower = verification.role.toLowerCase();
    const tokens = await this.getTokens(registeredUser.id, registeredUser.email, roleLower);
    await this.updateRefreshToken(registeredUser.id, tokens.refresh_token, roleLower);

    return {
      ...tokens,
      [roleLower]: {
        ...registeredUser,
        role: verification.role,
      },
    } as any;
  }

  async loginUser(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await this.userService.findByEmail(email);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      if (!user.password) {
        throw new NotFoundException('User has no password set');
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }

      if (user.isSuspended) {
        throw new UnauthorizedException('Your account has been suspended. Please contact support.');
      }

      const tokens = await this.getTokens(user.id, user.email, 'user');
      await this.updateRefreshToken(user.id, tokens.refresh_token, 'user');

      // Update lastLoginAt and set isActive to true
      await this.userService.updateUser(user.id, { 
        lastLoginAt: new Date(),
        isActive: true,
      } as any);

      return {
        ...tokens,
        user: { 
            id: user.id, 
            isAdmin: false, 
            isActive: true, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            role: 'user',
            onboardingCompleted: user.onboardingCompleted,
            plan: user.plan || {
              id: 'default-free',
              name: 'Free Tier',
              type: 'FREE',
              price: 0,
              description: ['Basic access'],
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
        },
      };
    } catch (error) {
      this.logger.error('User login error', error);
      throw error;
    }
  }


  async loginSpecialist(email: string, password: string): Promise<AuthResponse> {
    try {
      const specialist = await this.specialistService.findByEmail(email);
      
      if (!specialist) {
        throw new NotFoundException('Specialist not found');
      }

      const passwordMatch = await bcrypt.compare(password, specialist.password);
      
      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }

      if (specialist.isSuspended) {
        throw new UnauthorizedException('Your account has been suspended. Please contact support.');
      }

      const tokens = await this.getTokens(specialist.id, specialist.email, 'specialist');
      await this.updateRefreshToken(specialist.id, tokens.refresh_token, 'specialist');

      // Update lastLoginAt and set isActive to true
      await this.specialistService.updateSpecialist(specialist.id, { 
        lastLoginAt: new Date(),
        isActive: true,
      } as any);

      return {
        ...tokens,
        specialist: { 
            id: specialist.id, 
            isSpecialist: true, 
            isActive: true, 
            firstName: specialist.firstName, 
            lastName: specialist.lastName, 
            role: 'specialist',
            type: specialist.type
        },
      };
    } catch (error) {
      this.logger.error('Specialist login error', error);
      throw error;
    }
  }

  async getTokens(userId: string, email: string, role: string, type?: string) {
    const payload = { sub: userId, id: userId, email, role, type };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string, role: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    if (role === 'user') {
      await this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
    } else if (role === 'admin') {
      await this.adminService.updateAdmin(userId, { refreshToken: hashedRefreshToken });
    } else if (role === 'vendor') {
      await this.vendorService.updateVendor(userId, { refreshToken: hashedRefreshToken });
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtSecret,
      });
      const userId = payload.sub || payload.id;
      const role = payload.role;

      let user;
      if (role === 'user') {
        user = await this.userService.findOneUser(userId);
      } else if (role === 'admin') {
        user = await this.adminService.findOneAdmin(userId);
      } else if (role === 'vendor') {
        user = await this.vendorService.findOneVendor(userId);
      }

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user.id, user.email, role);
      await this.updateRefreshToken(user.id, tokens.refresh_token, role);
      return tokens;
    } catch (_e) {
      throw new UnauthorizedException('Access Denied');
    }
  }

  async registerAdmin(registerDto: CreateAdminDto): Promise<void> {  
    await this.adminService.createAdmin({
      email: registerDto.email,
      password: registerDto.password, 
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNo: registerDto.phoneNo,
      type: registerDto.type, 
      isActive: true,
      username: registerDto.username || registerDto.email.split('@')[0],
    });

    // 📧 Notify Admins
    await this.adminNotificationService.notify(
        'ACCOUNT',
        'New Admin Created',
        `<p>A new <strong>Admin</strong> account has been created.</p>
         <p><strong>Email:</strong> ${registerDto.email}</p>
         <p><strong>Type:</strong> ${registerDto.type}</p>
         <p><strong>Name:</strong> ${registerDto.firstName} ${registerDto.lastName}</p>`
      );
  }

  async loginAdmin(_email: string, _password: string): Promise<AuthResponse> {
    try {
      const admin = await this.adminService.findByEmail(_email);
      
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      
      if (!admin.password) {
        throw new NotFoundException('Admin has no password set');
      }
      
      const passwordMatch = await bcrypt.compare(_password, admin.password);
      
      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }
      if (admin.isSuspended) {
        throw new UnauthorizedException('Your account has been suspended. Please contact support.');
      }
      
      const tokens = await this.getTokens(admin.id, admin.email, 'admin', admin.type);
      await this.updateRefreshToken(admin.id, tokens.refresh_token, 'admin');

      // Update lastLoginAt and set isActive to true
      await this.adminService.updateAdmin(admin.id, { 
        lastLoginAt: new Date(),
        isActive: true,
      } as any);

      return { 
        ...tokens, 
        admin: { 
            id: admin.id, 
            isAdmin: true, 
            isActive: true, 
            username: admin.username ?? '', 
            role: 'ADMIN',
            type: admin.type
        } 
      };
    } catch (error) {
      this.logger.error('Admin login error', error);
      throw error;
    }
  }



  async loginVendor(_email: string, _password: string): Promise<AuthResponse> {
    try {
      const vendor = await this.vendorService.findByEmail(_email);

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      if (!vendor.password) {
        throw new NotFoundException('Vendor has no password set');
      }

      const passwordMatch = await bcrypt.compare(_password, vendor.password);

      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }
      if (vendor.isSuspended) {
        throw new UnauthorizedException('Your account has been suspended. Please contact support.');
      }

      const tokens = await this.getTokens(vendor.id, vendor.email, 'vendor');
      await this.updateRefreshToken(vendor.id, tokens.refresh_token, 'vendor');

      // Update lastLoginAt and set isActive to true
      await this.vendorService.updateVendor(vendor.id, { 
        lastLoginAt: new Date(),
        isActive: true,
      } as any);

      return {
        ...tokens,
        vendor: { 
            id: vendor.id, 
            isVendor: true, 
            isActive: true, 
            companyName: vendor.companyName, 
            role: 'VENDOR' 
        }
      };
    } catch (error) {
      this.logger.error('Vendor login error', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return 'If an account with that email exists, a password reset link has been sent.';
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); 

    await this.userService.updateUser(user.id, {
      resetToken: resetCode,
      resetTokenExpiry,
    });

    try {
        await this.mailService.sendResetPasswordEmail(email, resetCode);
        this.logger.log(`Reset link generated for ${email}`);
    } catch (err) {
        this.logger.error(`Mail dispatch failed for ${email}`, err);
    }

    return 'If an account with that email exists, a password reset link has been sent.';
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.userService.findByResetToken(token);
    if (!user || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Reset token has expired');
    }

    if (user.resetToken !== token) {
      throw new BadRequestException('Invalid reset token');
    }

    await this.userService.updateUser(user.id, {
      password: newPassword,
      resetToken: null, 
      resetTokenExpiry: null,
    });

    return 'Password has been reset successfully';
  }

  

    async deleteAccount(userId: string): Promise<string> {

      const user = await this.userService.findOneUser(userId);

      if (!user) {

        throw new NotFoundException('User not found');

      }

  

      await this.userService.updateUser(userId, {

        deletedAt: new Date(),

        isActive: false,

      });

  

      return 'Account deletion request submitted successfully';

    }

  

    async logout(userId: string, role: string): Promise<void> {

      if (role === 'user') {
        await this.userService.updateUser(userId, { refreshToken: null, isActive: false });

      } else if (role === 'admin') {
        await this.adminService.updateAdmin(userId, { refreshToken: null, isActive: false });

      } else if (role === 'vendor') {
        await this.vendorService.updateVendor(userId, { refreshToken: null, isActive: false });

      } else {

        throw new BadRequestException('Invalid user role for logout');

      }

      this.logger.log(`User ${userId} with role ${role} logged out successfully.`);

    }

  }

  