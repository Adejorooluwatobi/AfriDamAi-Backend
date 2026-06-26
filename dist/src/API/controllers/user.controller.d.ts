import { UserService } from 'src/domain/services/user.service';
import { CreateUserDto } from 'src/application/DTOs/users/create-user.dto';
import { UpdateUserDto } from 'src/application/DTOs/users/update-user.dto';
import { CartService } from 'src/domain/services/cart.service';
import { SecureUserResponseDto } from 'src/application/DTOs/response.dto';
import { UpdateAccountStatusDto } from 'src/application/DTOs/update-account-status.dto';
import { UpdateSuspensionStatusDto } from 'src/application/DTOs/update-suspension-status.dto';
export declare class UserController {
    private readonly userService;
    private readonly cartService;
    constructor(userService: UserService, cartService: CartService);
    create(createUserDto: CreateUserDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureUserResponseDto;
    }>;
    uploadAvatar(req: any, file: any): Promise<{
        succeeded: boolean;
        message: string;
        url: string;
    }>;
    findAll(): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureUserResponseDto[];
    }>;
    getMe(req: any): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureUserResponseDto;
    }>;
    private extractUserId;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureUserResponseDto;
    }>;
    findUser(id: string): Promise<{
        succeeded: boolean;
        resultData: SecureUserResponseDto;
    }>;
    delete(id: string): Promise<{
        succeeded: boolean;
        message: string;
    }>;
    updateStatus(id: string, statusDto: UpdateAccountStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureUserResponseDto;
    }>;
    updateSuspensionStatus(id: string, statusDto: UpdateSuspensionStatusDto): Promise<{
        succeeded: boolean;
        message: string;
        resultData: SecureUserResponseDto;
    }>;
}
