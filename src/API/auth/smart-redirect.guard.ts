import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmartRedirectGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Verify the token
        const jwtSecret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
        const payload = this.jwtService.verify(token, { secret: jwtSecret });
        
        if (payload && payload.sub) {
          // User is authenticated, redirect to dashboard
          response.redirect('/dashboard');
          return false;
        }
      } catch (error) {
        // Token is invalid, allow access to landing page
        return true;
      }
    }
    
    // No token or invalid token, allow access
    return true;
  }
}