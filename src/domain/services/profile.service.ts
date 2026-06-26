import { Injectable, ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { ProfileEntity } from "../entities/profile.entity";
import { CreateProfileParams, UpdateProfileParams } from "src/utils/type";
import type { IProfileRepository } from "../repositories/profile.repository.interface";

@Injectable()
export class ProfileService {
    constructor(@Inject('IProfileRepository')private readonly profileRepository: IProfileRepository) {}

    async createProfile(profileDetails: CreateProfileParams): Promise<ProfileEntity> {
        const existingProfile = await this.profileRepository.findByUserId(profileDetails.userId, 'user');
        if (existingProfile) {
            throw new ConflictException(`Profile already exists for this user`);
        }
        
        const profile = await this.profileRepository.create(profileDetails);
        return profile;
    }

    async findByUserId(userId: string): Promise<ProfileEntity | null> {
        return this.profileRepository.findByUserId(userId, 'user');
    }

    async getAllProfiles(): Promise<ProfileEntity[]> {
        return this.profileRepository.findAll();
    }

    async getProfileById(id: string): Promise<ProfileEntity | null> {
        return this.profileRepository.findById(id);
    }

    async updateProfile(userId: string, updateData: UpdateProfileParams): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findByUserId(userId, 'user');
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        return this.profileRepository.update(profile.id, updateData);
    }

    async skipOnboarding(userId: string): Promise<ProfileEntity> {
        let profile = await this.profileRepository.findByUserId(userId, 'user');
        
        if (!profile) {
            // Create a minimal profile with onboarding skipped
            profile = await this.profileRepository.create({
                userId,
                onboardingSkipped: true
            });
        } else {
            // Update existing profile to mark onboarding as skipped
            profile = await this.profileRepository.update(profile.id, {
                onboardingSkipped: true
            });
        }
        
        return profile;
    }

    async deleteProfile(id: string): Promise<void> {
        return this.profileRepository.delete(id);
    }

    // Legacy methods for backward compatibility
    async createProfileLegacy(profileDetails: CreateProfileParams, userId: string, userType: string): Promise<ProfileEntity> {
        const existingProfile = await this.profileRepository.findByUserId(userId, userType);
        if (existingProfile) {
            throw new ConflictException(`Profile already exists for this user`);
        }
        const { userId: _, ...profileData } = profileDetails;
        const profileCreateData: any = { ...profileData };
        
        // Set the appropriate user ID field based on user type
        if (userType === 'user') profileCreateData.userId = userId;
        
        const profile = await this.profileRepository.create(profileCreateData);
        return profile;
    }

    async getProfileByUserId(userId: string, userType: string): Promise<ProfileEntity | null> {
        return this.profileRepository.findByUserId(userId, userType);
    }
}