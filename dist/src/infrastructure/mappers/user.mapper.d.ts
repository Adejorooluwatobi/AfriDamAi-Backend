import { UserEntity } from '../../domain/entities/user.entity';
import { User, Profile, UserSubscription, AI as Analyzer, PricingPlan } from '@prisma/client';
import { SecureUserResponseDto } from 'src/application/DTOs/response.dto';
type UserWithRelations = User & {
    profile?: Profile | null;
    subscriptions?: UserSubscription[];
    aiScans?: Analyzer[];
    currentPricingPlan?: PricingPlan | null;
};
export declare class UserMapper {
    static toDomain(prismaUser: UserWithRelations): UserEntity;
    static toPersistence(user: UserEntity): Omit<User, 'createdAt' | 'updatedAt'>;
    static toSecureUserResponseDto(user: UserEntity): SecureUserResponseDto;
}
export {};
