import { ConfigService } from '@nestjs/config';
import { UploadedFile } from 'src/utils/type';
import { EnvironmentService } from './environment.service';
export declare class FileUploadService {
    private configService;
    private envService;
    private readonly logger;
    private readonly storage;
    constructor(configService: ConfigService, envService: EnvironmentService);
    private uploadToGcs;
    uploadImageFile(file: UploadedFile): Promise<string>;
    uploadAudioFile(file: UploadedFile): Promise<string>;
    uploadVideoFile(file: UploadedFile): Promise<string>;
    uploadGenericFile(file: UploadedFile): Promise<string>;
    private compressImage;
    private validateAudioFile;
    private validateImageFile;
    private validateVideoFile;
    private validateGenericFile;
}
