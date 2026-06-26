import { UserEntity } from '../entities/user.entity';
import type { IUserRepository } from '../repositories/user.repository.interface';
import { CreateUserParams, UpdateUserParams } from 'src/utils/type';
import { WalletService } from './wallet.service';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';
export declare class UserService {
    private readonly userRepository;
    private readonly walletService;
    private readonly fileUploadService;
    private readonly mailService;
    private readonly logger;
    constructor(userRepository: IUserRepository, walletService: WalletService, fileUploadService: FileUploadService, mailService: MailService);
    createUser(userDetails: CreateUserParams): Promise<UserEntity>;
    updateUser(id: string, updateUserDetails: UpdateUserParams): Promise<UserEntity>;
    updateUserAvatar(id: string, file: any): Promise<UserEntity>;
    findAllUser(): Promise<UserEntity[]>;
    findOneUser(id: string): Promise<UserEntity | null>;
    deleteUser(id: string): Promise<void>;
    updateUserActiveStatus(id: string, isActive: boolean): Promise<UserEntity>;
    updateUserSuspensionStatus(id: string, isSuspended: boolean): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findByResetToken(resetToken: string): Promise<UserEntity | null>;
    private isValidEmail;
    private sanitizeInput;
}
