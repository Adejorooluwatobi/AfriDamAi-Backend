import { 
  BadRequestException, 
  ConflictException, 
  Inject, 
  Injectable, 
  Logger, 
  NotFoundException,
  InternalServerErrorException 
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import type { IUserRepository } from '../repositories/user.repository.interface';
import { CreateUserParams, UpdateUserParams } from 'src/utils/type';
import { WalletService } from './wallet.service'; // Import WalletService
import { WalletOwnerType } from '@prisma/client'; // Import WalletOwnerType
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { MailService } from 'src/infrastructure/messaging/mail/mail.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly walletService: WalletService, // Inject WalletService
    private readonly fileUploadService: FileUploadService, // Inject FileUploadService
    private readonly mailService: MailService,
  ) {}

  async createUser(userDetails: CreateUserParams): Promise<UserEntity> {
    if (!userDetails.email || !userDetails.password) {
      throw new BadRequestException('Email and password are required');
    }
    const existingUser = await this.userRepository.findByEmail(userDetails.email);
    if (existingUser) {  
      throw new ConflictException(`User with email ${userDetails.email} already exists`);
    } 
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const newUser = await this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
      isActive: userDetails.isActive ?? true
    });
    this.logger.log(`User created successfully: ${newUser.id}`);

    // Create a wallet for the new user
    await this.walletService.createWallet({
        ownerId: newUser.id,
        ownerType: WalletOwnerType.USER,
        initialBalance: 0,
    });
    this.logger.log(`Wallet created for user: ${newUser.id}`);

    return newUser;
  }

  /**
   * 🛡️ RE-ENFORCED: Update User
   * Handles nested profile updates and onboarding flags with strict type safety.
   */
  async updateUser(id: string, updateUserDetails: UpdateUserParams): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // 1. Handle Password Hashing if updated
    if (updateUserDetails.password) {
      updateUserDetails.password = await bcrypt.hash(updateUserDetails.password, 10);
    }

    // 2. 🛡️ OGA FIX: Clean Build Sync
    // We cast to any here to satisfy the compiler while we sync the new Prisma fields
    const finalUpdate: any = {
      ...updateUserDetails,
    };

    // Ensure root onboarding flag is prioritized
    if (updateUserDetails.onboardingCompleted !== undefined) {
      finalUpdate.onboardingCompleted = updateUserDetails.onboardingCompleted;
    }

    // Deep Merge Profile
    if (updateUserDetails.profile) {
      finalUpdate.profile = {
        ...(user.profile || {}),
        ...updateUserDetails.profile,
        // Sync the onboarding flag inside the profile as well
        onboardingCompleted: updateUserDetails.onboardingCompleted ?? user.onboardingCompleted
      };
    }

    const updatedUser = await this.userRepository.update(id, finalUpdate);
    this.logger.log(`User updated successfully: ${updatedUser.id}`);
    return updatedUser;
  }

  /**
   * 🛡️ OGA FIX: Update User Avatar
   * Syncs the uploaded file path to the user profile entity.
   */
  async updateUserAvatar(id: string, file: any): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    // 🚀 OGA FIX: Actually save and compress the file
    this.logger.log(`Uploading avatar for user: ${id}`);
    const avatarUrl = await this.fileUploadService.uploadImageFile(file);

    const updateParams: any = {
      profile: {
        ...(user.profile || {}),
        avatarUrl: avatarUrl
      }
    };

    return this.userRepository.update(id, updateParams);
  }

  async findAllUser(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findOneUser(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    
    await this.userRepository.delete(id);
    this.logger.log(`User deleted successfully: ${user.id}`);
  }

  async updateUserActiveStatus(id: string, isActive: boolean): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const updatedUser = await this.userRepository.update(id, { isActive });
    this.logger.log(`User active status updated: ${id} is now ${isActive ? 'active' : 'inactive'}`);
    
    // 📧 Notify User
    await this.mailService.sendAccountStatusEmail(
        user.email,
        user.firstName || 'User',
        isActive ? 'ACTIVATED' : 'DEACTIVATED',
        'CLIENT'
    );

    return updatedUser;
  }

  async updateUserSuspensionStatus(id: string, isSuspended: boolean): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const updatedUser = await this.userRepository.update(id, { isSuspended });
    this.logger.log(`User suspension status updated: ${id} is now ${isSuspended ? 'suspended' : 'unsuspended'}`);

    // 📧 Notify User
    await this.mailService.sendAccountStatusEmail(
        user.email,
        user.firstName || 'User',
        isSuspended ? 'SUSPENDED' : 'UNSUSPENDED',
        'CLIENT'
    );

    return updatedUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
      throw new BadRequestException('Valid email is required');
    }
    const sanitizedEmail = email.trim();
    return this.userRepository.findByEmail(sanitizedEmail);
  }

  async findByResetToken(resetToken: string): Promise<UserEntity | null> {
    if (!resetToken || typeof resetToken !== 'string') {
      throw new BadRequestException('Valid reset token is required');
    }
    const sanitizedToken = this.sanitizeInput(resetToken);
    return this.userRepository.findByResetToken(sanitizedToken);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[\r\n\t]/g, '').trim();
  }
}