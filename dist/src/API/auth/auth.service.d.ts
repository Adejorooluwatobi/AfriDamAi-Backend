import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateVendorDto } from 'src/application/DTOs/vendor/create-vendor.dto';
import { AdminService } from 'src/domain/services/admin.service';
import { UserService } from 'src/domain/services/user.service';
import { VendorService } from 'src/domain/services/vendor.service';
import { MailService } from '../../infrastructure/messaging/mail/mail.service';
import { CreateUserDto } from 'src/application/DTOs/users/create-user.dto';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { SpecialistService } from 'src/domain/services/specialist.service';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { PrismaEmailVerificationRepository } from 'src/infrastructure/persistence/prisma/prisma-email-verification.repository';
import { AdminNotificationService } from 'src/domain/services/admin-notification.service';
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
        role: string;
    };
    specialist?: {
        id: string;
        isSpecialist: boolean;
        isActive: boolean;
        firstName: string;
        lastName: string;
        role: string;
        type: any;
    };
}
export declare class AuthService {
    private configService;
    private jwtService;
    private userService;
    private adminService;
    private vendorService;
    private specialistService;
    private mailService;
    private emailVerificationRepo;
    private adminNotificationService;
    private readonly logger;
    private readonly jwtSecret;
    constructor(configService: ConfigService, jwtService: JwtService, userService: UserService, adminService: AdminService, vendorService: VendorService, specialistService: SpecialistService, mailService: MailService, emailVerificationRepo: PrismaEmailVerificationRepository, adminNotificationService: AdminNotificationService);
    hashPassword(password: string): Promise<string>;
    registerUser(registerDto: CreateUserDto): Promise<void>;
    registerVendor(registerDto: CreateVendorDto): Promise<void>;
    registerSpecialist(registerDto: CreateSpecialistDto): Promise<void>;
    private initiateRegistration;
    completeRegistration(email: string, code: string): Promise<AuthResponse>;
    loginUser(email: string, password: string): Promise<AuthResponse>;
    loginSpecialist(email: string, password: string): Promise<AuthResponse>;
    getTokens(userId: string, email: string, role: string, type?: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string, role: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    registerAdmin(registerDto: CreateAdminDto): Promise<void>;
    loginAdmin(_email: string, _password: string): Promise<AuthResponse>;
    loginVendor(_email: string, _password: string): Promise<AuthResponse>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<string>;
    deleteAccount(userId: string): Promise<string>;
    logout(userId: string, role: string): Promise<void>;
}
