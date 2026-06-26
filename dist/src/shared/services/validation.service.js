"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let ValidationService = class ValidationService {
    constructor() {
        this.allowedImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        this.maxFileSize = 5 * 1024 * 1024;
        this.allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    }
    validateImageFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size exceeds 5MB limit');
        }
        const ext = (0, path_1.extname)(file.originalname).toLowerCase();
        if (!this.allowedImageTypes.includes(ext)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed');
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid MIME type');
        }
        if (this.containsSuspiciousContent(file.originalname)) {
            throw new common_1.BadRequestException('Suspicious file name detected');
        }
    }
    validateUserId(userId) {
        if (!userId || typeof userId !== 'string') {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const cuidRegex = /^[a-z0-9]{20,32}$/i;
        if (!uuidRegex.test(userId) && !cuidRegex.test(userId)) {
            throw new common_1.BadRequestException('Invalid user ID format');
        }
    }
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new common_1.BadRequestException('Invalid email');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
    }
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        return input
            .replace(/[<>]/g, '')
            .replace(/['"]/g, '')
            .trim();
    }
    containsSuspiciousContent(filename) {
        const suspiciousPatterns = [
            /\.(exe|bat|cmd|scr|pif|com)$/i,
            /\.\./,
            /[<>:"\\|?*]/,
            /script/i,
            /javascript/i
        ];
        return suspiciousPatterns.some(pattern => pattern.test(filename));
    }
};
exports.ValidationService = ValidationService;
exports.ValidationService = ValidationService = __decorate([
    (0, common_1.Injectable)()
], ValidationService);
//# sourceMappingURL=validation.service.js.map