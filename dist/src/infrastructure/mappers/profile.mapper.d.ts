import { Profile } from '@prisma/client';
import { ProfileEntity } from '../../domain/entities/profile.entity';
export declare class ProfileMapper {
    static toDomain(prismaProfile: Profile): ProfileEntity;
    static toDomainArray(prismaProfiles: Profile[]): ProfileEntity[];
    static toPersistence(profile: ProfileEntity): Omit<Profile, 'createdAt' | 'updatedAt'>;
}
