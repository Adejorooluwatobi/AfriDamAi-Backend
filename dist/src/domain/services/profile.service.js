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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
let ProfileService = class ProfileService {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }
    async createProfile(profileDetails) {
        const existingProfile = await this.profileRepository.findByUserId(profileDetails.userId, 'user');
        if (existingProfile) {
            throw new common_1.ConflictException(`Profile already exists for this user`);
        }
        const profile = await this.profileRepository.create(profileDetails);
        return profile;
    }
    async findByUserId(userId) {
        return this.profileRepository.findByUserId(userId, 'user');
    }
    async getAllProfiles() {
        return this.profileRepository.findAll();
    }
    async getProfileById(id) {
        return this.profileRepository.findById(id);
    }
    async updateProfile(userId, updateData) {
        const profile = await this.profileRepository.findByUserId(userId, 'user');
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return this.profileRepository.update(profile.id, updateData);
    }
    async skipOnboarding(userId) {
        let profile = await this.profileRepository.findByUserId(userId, 'user');
        if (!profile) {
            profile = await this.profileRepository.create({
                userId,
                onboardingSkipped: true
            });
        }
        else {
            profile = await this.profileRepository.update(profile.id, {
                onboardingSkipped: true
            });
        }
        return profile;
    }
    async deleteProfile(id) {
        return this.profileRepository.delete(id);
    }
    async createProfileLegacy(profileDetails, userId, userType) {
        const existingProfile = await this.profileRepository.findByUserId(userId, userType);
        if (existingProfile) {
            throw new common_1.ConflictException(`Profile already exists for this user`);
        }
        const { userId: _, ...profileData } = profileDetails;
        const profileCreateData = { ...profileData };
        if (userType === 'user')
            profileCreateData.userId = userId;
        const profile = await this.profileRepository.create(profileCreateData);
        return profile;
    }
    async getProfileByUserId(userId, userType) {
        return this.profileRepository.findByUserId(userId, userType);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IProfileRepository')),
    __metadata("design:paramtypes", [Object])
], ProfileService);
//# sourceMappingURL=profile.service.js.map