import { ConfigService } from '@nestjs/config';
import { VendorService } from 'src/domain/services/vendor.service';
import { UserService } from 'src/domain/services/user.service';
import { AdminService } from 'src/domain/services/admin.service';
import { SpecialistService } from 'src/domain/services/specialist.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private vendorService;
    private userService;
    private adminService;
    private specialistService;
    constructor(configService: ConfigService, vendorService: VendorService, userService: UserService, adminService: AdminService, specialistService: SpecialistService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        role: string;
        type: string;
        vendor: {
            id: any;
            companyName: any;
            isActive: any;
        };
        user?: undefined;
        specialist?: undefined;
        admin?: undefined;
    } | {
        id: string;
        email: string;
        role: string;
        type: string;
        user: {
            id: any;
            firstName: any;
            lastName: any;
            isActive: any;
            onboardingCompleted: any;
            plan: any;
        };
        vendor?: undefined;
        specialist?: undefined;
        admin?: undefined;
    } | {
        id: string;
        email: string;
        role: string;
        type: string;
        specialist: {
            id: any;
            firstName: any;
            lastName: any;
            isActive: any;
        };
        vendor?: undefined;
        user?: undefined;
        admin?: undefined;
    } | {
        id: string;
        email: string;
        role: string;
        type: any;
        admin: {
            id: any;
            username: any;
            isActive: any;
            type: any;
        };
        vendor?: undefined;
        user?: undefined;
        specialist?: undefined;
    } | {
        id: string;
        email: string;
        role: string;
        type?: undefined;
        vendor?: undefined;
        user?: undefined;
        specialist?: undefined;
        admin?: undefined;
    }>;
}
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
}
export {};
