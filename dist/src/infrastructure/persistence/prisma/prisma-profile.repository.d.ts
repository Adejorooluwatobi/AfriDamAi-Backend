import { PrismaService } from "./prisma.service";
import { ProfileEntity } from "src/domain/entities/profile.entity";
import { IProfileRepository } from "src/domain/repositories/profile.repository.interface";
import { CreateProfileParams, UpdateProfileParams } from "src/utils/type";
export declare class PrismaProfileRepository implements IProfileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<ProfileEntity | null>;
    findByEmail(email: string): Promise<ProfileEntity | null>;
    findAll(): Promise<ProfileEntity[]>;
    findByUserId(userId: string, userType?: string): Promise<ProfileEntity | null>;
    create(profileData: CreateProfileParams): Promise<ProfileEntity>;
    update(id: string, profileData: Partial<UpdateProfileParams>): Promise<ProfileEntity>;
    delete(id: string): Promise<void>;
}
