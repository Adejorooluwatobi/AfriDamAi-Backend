import { CreateUserParams, UpdateUserParams } from 'src/utils/type';
import { UserEntity } from '../entities/user.entity';
export interface IUserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByResetToken(resetToken: string): Promise<UserEntity | null>;
    create(user: CreateUserParams): Promise<UserEntity>;
    update(id: string, user: Partial<UpdateUserParams>): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}
