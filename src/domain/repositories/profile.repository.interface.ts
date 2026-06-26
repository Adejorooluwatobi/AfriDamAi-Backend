import { CreateProfileParams, UpdateProfileParams } from 'src/utils/type';
import { ProfileEntity } from '../entities/profile.entity';

export interface IProfileRepository {
  findById(id: string): Promise<ProfileEntity | null>;
  findByEmail(email: string): Promise<ProfileEntity | null>;
  findAll(): Promise<ProfileEntity[]>;
  findByUserId(userId: string, userType: string): Promise<ProfileEntity | null>;
  create(user: CreateProfileParams): Promise<ProfileEntity>;
  update(id: string, user: Partial<UpdateProfileParams>): Promise<ProfileEntity>;
  delete(id: string): Promise<void>;
}