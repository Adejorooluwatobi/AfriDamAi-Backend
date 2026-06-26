import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ProfileEntity } from "src/domain/entities/profile.entity";
import { IProfileRepository } from "src/domain/repositories/profile.repository.interface";
import { ProfileMapper } from "src/infrastructure/mappers/profile.mapper";
import { CreateProfileParams, UpdateProfileParams } from "src/utils/type";
import { Profile } from "@prisma/client";


@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<ProfileEntity | null> {
        const profile = await this.prisma.profile.findUnique({ 
            where: { id },
            include: { user: true }
        });
        return profile ? ProfileMapper.toDomain(profile) : null;
    }

    async findByEmail(email: string): Promise<ProfileEntity | null> {
        const profile = await this.prisma.profile.findFirst({
            where: {
                user: { email }
            },
            include: { user: true }
        });
        return profile ? ProfileMapper.toDomain(profile) : null;
    }

    async findAll(): Promise<ProfileEntity[]> {
        const profiles = await this.prisma.profile.findMany({ 
            include: { user: true }
        });
        return ProfileMapper.toDomainArray(profiles);
    }

    async findByUserId(userId: string, userType: string = 'user'): Promise<ProfileEntity | null> {
        if (userType !== 'user') {
            throw new NotFoundException('Profile only exists for clinical users');
        }
        
        const profile = await this.prisma.profile.findFirst({ 
            where: { userId },
            include: { user: true }
        });
        return profile ? ProfileMapper.toDomain(profile) : null;
    }

    async create(profileData: CreateProfileParams): Promise<ProfileEntity> {
        // 🛡️ RE-ENFORCED: Standardize persistence mapping for clinical data
        const { userId, previousTreatments, ...rest } = profileData;
        
        // Explicitly map fields to match Prisma schema
        const prismaData: any = {
            ...rest,
            userId,
            previousTreatment: previousTreatments || []
        };

        // Remove non-persistence fields that might be in the params but not in schema
        delete prismaData.skinHistory;
        delete prismaData.knownSkinCondition;
        delete prismaData.knownBodyLotion;
        delete prismaData.knownBodyLotionBrand;

        const profile = await this.prisma.profile.create({ 
            data: prismaData,
            include: { user: true }
        });
        return ProfileMapper.toDomain(profile);
    }

    async update(id: string, profileData: Partial<UpdateProfileParams>): Promise<ProfileEntity> {
        if (!id) {
            throw new NotFoundException('Invalid profile ID');
        }

        // 🛡️ OGA FIX: map fields to match Prisma schema
        const { previousTreatments, ...rest } = profileData;
        const prismaData: any = { ...rest };
        
        if (previousTreatments !== undefined) {
            prismaData.previousTreatment = previousTreatments;
        }

        // Remove non-persistence fields
        delete prismaData.skinHistory;
        delete prismaData.knownSkinCondition;
        delete prismaData.knownBodyLotion;
        delete prismaData.knownBodyLotionBrand;

        const profile = await this.prisma.profile.update({ 
            where: { id }, 
            data: prismaData, 
            include: { user: true }
        });
        return ProfileMapper.toDomain(profile);
    }

    async delete(id: string): Promise<void> {
        if (!id) {
            throw new NotFoundException('Invalid profile ID');
        }
        await this.prisma.profile.delete({ where: { id } });
    }
}