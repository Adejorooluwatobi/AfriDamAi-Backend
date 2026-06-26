import { PrismaService } from './prisma.service';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { CreateUserParams, UpdateUserParams } from 'src/utils/type';
export declare class PrismaUserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
    create(userData: CreateUserParams): Promise<UserEntity>;
    update(id: string, userData: Partial<UpdateUserParams>): Promise<UserEntity>;
    findByResetToken(resetToken: string): Promise<UserEntity | null>;
    delete(id: string): Promise<void>;
}
