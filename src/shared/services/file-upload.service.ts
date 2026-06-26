import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadedFile } from 'src/utils/type';
import * as path from 'path';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

import { EnvironmentService } from './environment.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly storage: Storage;

  constructor(
    private configService: ConfigService,
    private envService: EnvironmentService,
  ) {
    this.storage = new Storage({
      keyFilename: this.envService.googleKeyFile,
    });
  }

  private async uploadToGcs(
    buffer: Buffer, 
    folder: string, 
    mimetype: string,
    originalName: string = 'file.bin'
  ): Promise<string> {
    const bucketName = this.envService.gcsBucketName;
    const bucket = this.storage.bucket(bucketName);
    
    // Generate a unique filename using uuid, preserving extension
    const extension = originalName.split('.').pop() || 'bin';
    const uniqueFilename = `${uuidv4()}.${extension}`;
    const destination = `${folder}/${uniqueFilename}`;
    
    const file = bucket.file(destination);
    
    await file.save(buffer, {
      contentType: mimetype,
      resumable: false,
    });
    
    return `https://storage.googleapis.com/${bucketName}/${destination}`;
  }

  /**
   * ✅ UPDATED: Uploads compressed image directly to GCS
   */
  async uploadImageFile(file: UploadedFile): Promise<string> {
    this.validateImageFile(file);
    
    // Compress image before saving
    const compressedBuffer = await this.compressImage(file.buffer);
    this.logger.debug(`🖼️ Compression: ${file.buffer.length} bytes -> ${compressedBuffer.length} bytes`);
    
    this.logger.log(`💾 Uploading image to GCS...`);
    return this.uploadToGcs(compressedBuffer, 'afridam/images', file.mimetype, file.originalname);
  }

  /**
   * ✅ UPDATED: Uploads audio to GCS
   */
  async uploadAudioFile(file: UploadedFile): Promise<string> {
    this.validateAudioFile(file);
    
    this.logger.log(`💾 Uploading audio to GCS...`);
    return this.uploadToGcs(file.buffer, 'afridam/audio', file.mimetype, file.originalname);
  }

  /**
   * ✅ UPDATED: Uploads video to GCS
   */
  async uploadVideoFile(file: UploadedFile): Promise<string> {
    this.validateVideoFile(file);
    
    this.logger.log(`💾 Uploading video to GCS...`);
    return this.uploadToGcs(file.buffer, 'afridam/videos', file.mimetype, file.originalname);
  }

  /**
   * ✅ NEW: Uploads any generic file (PDF, DOCX, etc.) to GCS
   */
  async uploadGenericFile(file: UploadedFile): Promise<string> {
    this.validateGenericFile(file);
    
    this.logger.log(`💾 Uploading generic file to GCS...`);
    return this.uploadToGcs(file.buffer, 'afridam/files', file.mimetype, file.originalname);
  }

  /**
   * 🖼️ NEW: Compresses image using sharp to reduce byte size
   */
  private async compressImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Reasonable max width
        .jpeg({ quality: 80, progressive: true, mozjpeg: true }) // Good balance of quality and size
        .toBuffer();
    } catch (error) {
      // If compression fails (e.g. invalid image), return original buffer
      return buffer;
    }
  }

  private validateAudioFile(file: UploadedFile): void {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid audio file type');
    }
    
    if (file.size > maxSize) {
      throw new BadRequestException('Audio file too large (max 50MB)');
    }
  }

  private validateImageFile(file: UploadedFile): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }
    
    if (file.size > maxSize) {
      throw new BadRequestException('Image file too large (max 5MB)');
    }
  }

  private validateVideoFile(file: UploadedFile): void {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid video file type');
    }
    
    if (file.size > maxSize) {
      throw new BadRequestException('Video file too large (max 100MB)');
    }
  }

  private validateGenericFile(file: UploadedFile): void {
    const maxSize = 20 * 1024 * 1024; // 20MB
    
    if (file.size > maxSize) {
      throw new BadRequestException('File too large (max 20MB)');
    }
  }
}