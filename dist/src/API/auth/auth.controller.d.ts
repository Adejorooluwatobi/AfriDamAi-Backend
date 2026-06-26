import { AuthService } from './auth.service';
import { AdminAccessTokenDto, SpecialistAccessTokenDto, UserAccessTokenDto, VendorAccessTokenDto } from './dto/access-token.dto';
import { AdminLoginDto, SpecialistLoginDto, UserLoginDto, VendorLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from 'src/application/DTOs/users/create-user.dto';
import { ForgotPasswordDto } from 'src/application/DTOs/users/forgot-password.dto';
import { ResetPasswordDto } from 'src/application/DTOs/users/reset-password.dto';
import { CreateVendorDto } from 'src/application/DTOs/vendor/create-vendor.dto';
import { CreateAdminDto } from 'src/application/DTOs/admin/create-admin.dto';
import { CreateSpecialistDto } from 'src/application/DTOs/specialist/create-specialist.dto';
import { VerifyRegistrationDto } from './dto/verify-registration.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(registerDto: CreateUserDto): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    userLogin(loginDto: UserLoginDto): Promise<UserAccessTokenDto>;
    registerSpecialist(registerDto: CreateSpecialistDto): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    specialistLogin(loginDto: SpecialistLoginDto): Promise<SpecialistAccessTokenDto>;
    verifyRegistration(verifyDto: VerifyRegistrationDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: import("./auth.service").AuthResponse;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    deleteAccount(req: any): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    registerAdmin(registerDto: CreateAdminDto): Promise<string>;
    adminLogin(loginDto: AdminLoginDto): Promise<AdminAccessTokenDto>;
    registerVendor(registerDto: CreateVendorDto): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    vendorLogin(loginDto: VendorLoginDto): Promise<VendorAccessTokenDto>;
    logout(req: any): Promise<{
        succeeded: boolean;
        message: string;
    }>;
}
