import { CreateProfileDto } from 'src/application/DTOs/profiles/create-profile.dto';
import { UpdateProfileDto } from 'src/application/DTOs/profiles/update-profile.dto';
import { ProfileService } from 'src/domain/services/profile.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';
export declare class ProfileController {
    private readonly profileService;
    private readonly fileUploadService;
    constructor(profileService: ProfileService, fileUploadService: FileUploadService);
    uploadAvatar(req: any, file: any): Promise<import("../../domain/entities/profile.entity").ProfileEntity>;
    createProfile(req: any, createProfileDto: CreateProfileDto): Promise<import("../../domain/entities/profile.entity").ProfileEntity>;
    getProfile(req: any): Promise<import("../../domain/entities/profile.entity").ProfileEntity>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("../../domain/entities/profile.entity").ProfileEntity>;
    skipOnboarding(req: any): Promise<import("../../domain/entities/profile.entity").ProfileEntity>;
}
