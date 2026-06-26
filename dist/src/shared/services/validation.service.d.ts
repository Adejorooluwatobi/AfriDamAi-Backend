import { UploadedFile } from 'src/utils/type';
export declare class ValidationService {
    private readonly allowedImageTypes;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    validateImageFile(file: UploadedFile): void;
    validateUserId(userId: string): void;
    validateEmail(email: string): void;
    sanitizeInput(input: string): string;
    private containsSuspiciousContent;
}
