"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FileUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sharp_1 = __importDefault(require("sharp"));
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
const environment_service_1 = require("./environment.service");
let FileUploadService = FileUploadService_1 = class FileUploadService {
    constructor(configService, envService) {
        this.configService = configService;
        this.envService = envService;
        this.logger = new common_1.Logger(FileUploadService_1.name);
        this.storage = new storage_1.Storage({
            keyFilename: this.envService.googleKeyFile,
        });
    }
    async uploadToGcs(buffer, folder, mimetype, originalName = 'file.bin') {
        const bucketName = this.envService.gcsBucketName;
        const bucket = this.storage.bucket(bucketName);
        const extension = originalName.split('.').pop() || 'bin';
        const uniqueFilename = `${(0, uuid_1.v4)()}.${extension}`;
        const destination = `${folder}/${uniqueFilename}`;
        const file = bucket.file(destination);
        await file.save(buffer, {
            contentType: mimetype,
            resumable: false,
        });
        return `https://storage.googleapis.com/${bucketName}/${destination}`;
    }
    async uploadImageFile(file) {
        this.validateImageFile(file);
        const compressedBuffer = await this.compressImage(file.buffer);
        this.logger.debug(`🖼️ Compression: ${file.buffer.length} bytes -> ${compressedBuffer.length} bytes`);
        this.logger.log(`💾 Uploading image to GCS...`);
        return this.uploadToGcs(compressedBuffer, 'afridam/images', file.mimetype, file.originalname);
    }
    async uploadAudioFile(file) {
        this.validateAudioFile(file);
        this.logger.log(`💾 Uploading audio to GCS...`);
        return this.uploadToGcs(file.buffer, 'afridam/audio', file.mimetype, file.originalname);
    }
    async uploadVideoFile(file) {
        this.validateVideoFile(file);
        this.logger.log(`💾 Uploading video to GCS...`);
        return this.uploadToGcs(file.buffer, 'afridam/videos', file.mimetype, file.originalname);
    }
    async uploadGenericFile(file) {
        this.validateGenericFile(file);
        this.logger.log(`💾 Uploading generic file to GCS...`);
        return this.uploadToGcs(file.buffer, 'afridam/files', file.mimetype, file.originalname);
    }
    async compressImage(buffer) {
        try {
            return await (0, sharp_1.default)(buffer)
                .resize({ width: 1200, withoutEnlargement: true })
                .jpeg({ quality: 80, progressive: true, mozjpeg: true })
                .toBuffer();
        }
        catch (error) {
            return buffer;
        }
    }
    validateAudioFile(file) {
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac'];
        const maxSize = 50 * 1024 * 1024;
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid audio file type');
        }
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Audio file too large (max 50MB)');
        }
    }
    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid image file type');
        }
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Image file too large (max 5MB)');
        }
    }
    validateVideoFile(file) {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const maxSize = 100 * 1024 * 1024;
        if (!allowedTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid video file type');
        }
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Video file too large (max 100MB)');
        }
    }
    validateGenericFile(file) {
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File too large (max 20MB)');
        }
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = FileUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        environment_service_1.EnvironmentService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map