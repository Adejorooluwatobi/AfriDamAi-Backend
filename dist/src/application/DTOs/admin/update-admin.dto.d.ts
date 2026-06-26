import { AdminType } from "src/domain/entities/admin.entity";
export declare class UpdateAdminDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    type?: AdminType;
    phoneNo?: string;
    password?: string;
}
