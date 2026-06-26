import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { UploadedFile } from 'src/utils/type';

@Injectable()
export class ValidationService {
  private readonly allowedImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  /**
   * ✅ FIXED: Using UploadedFile instead of Express.Multer.File 
   * to bypass global namespace issues in Cloud Shell/Cloud Build.
   */
  validateImageFile(file: UploadedFile): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Check file extension
    const ext = extname(file.originalname).toLowerCase();
    if (!this.allowedImageTypes.includes(ext)) {
      throw new BadRequestException('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed');
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid MIME type');
    }

    // Check for potential malicious content
    if (this.containsSuspiciousContent(file.originalname)) {
      throw new BadRequestException('Suspicious file name detected');
    }
  }

  validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('Invalid user ID');
    }

    // Basic UUID or CUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const cuidRegex = /^[a-z0-9]{20,32}$/i; 
    
    if (!uuidRegex.test(userId) && !cuidRegex.test(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
  }

  validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Invalid email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes to prevent injection
      .trim();
  }

  private containsSuspiciousContent(filename: string): boolean {
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|scr|pif|com)$/i,
      /\.\./,
      /[<>:"\\|?*]/,
      /script/i,
      /javascript/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(filename));
  }
}