import { ProfileEntity } from "../entities/profile.entity";
import { CreateProfileParams, UpdateProfileParams } from "src/utils/type";
import type { IProfileRepository } from "../repositories/profile.repository.interface";
export declare class ProfileService {
    private readonly profileRepository;
    constructor(profileRepository: IProfileRepository);
    createProfile(profileDetails: CreateProfileParams): Promise<ProfileEntity>;
    findByUserId(userId: string): Promise<ProfileEntity | null>;
    getAllProfiles(): Promise<ProfileEntity[]>;
    getProfileById(id: string): Promise<ProfileEntity | null>;
    updateProfile(userId: string, updateData: UpdateProfileParams): Promise<ProfileEntity>;
    skipOnboarding(userId: string): Promise<ProfileEntity>;
    deleteProfile(id: string): Promise<void>;
    createProfileLegacy(profileDetails: CreateProfileParams, userId: string, userType: string): Promise<ProfileEntity>;
    getProfileByUserId(userId: string, userType: string): Promise<ProfileEntity | null>;
}
