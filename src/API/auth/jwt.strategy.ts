import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { VendorService } from 'src/domain/services/vendor.service';
import { UserService } from 'src/domain/services/user.service';
import { AdminService } from 'src/domain/services/admin.service';
import { SpecialistService } from 'src/domain/services/specialist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private vendorService: VendorService,
    private userService: UserService,
    private adminService: AdminService,
    private specialistService: SpecialistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    let user: any;
    if (payload.role === 'vendor') {
      user = await this.vendorService.findOneVendor(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Vendor not found');
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        type: 'vendor', // Ensure type is present
        vendor: { id: user.vendor.id, companyName: user.vendor.companyName, isActive: user.vendor.isActive },
      };
    } else if (payload.role === 'user') {
      user = await this.userService.findOneUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        type: 'user', // Ensure type is present
        user: { 
          id: user.id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          isActive: user.isActive, 
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
    } else if (payload.role === 'specialist') { // Handle specialist role
      user = await this.specialistService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Specialist not found');
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        type: 'specialist', // Ensure type is present
        specialist: { id: user.specialist.id, firstName: user.specialist.firstName, lastName: user.specialist.lastName, isActive: user.specialist.isActive },
      };
    } else if (payload.role === 'admin') {
      user = await this.adminService.findOneAdmin(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Admin not found');
      }
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        type: user.type, // Add type directly to the user object (e.g. SUPER_ADMIN, etc.)
        admin: { id: user.id, username: user.username, isActive: user.isActive, type: user.type },
      };
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
