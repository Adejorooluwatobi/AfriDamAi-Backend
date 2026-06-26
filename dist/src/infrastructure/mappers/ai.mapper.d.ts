import { User, Profile } from '@prisma/client';
import { AiMoreInfo } from 'src/utils/type';
export declare class AiMapper {
    static toAiMoreInfo(user: User | null, profile: Profile | null): AiMoreInfo;
}
