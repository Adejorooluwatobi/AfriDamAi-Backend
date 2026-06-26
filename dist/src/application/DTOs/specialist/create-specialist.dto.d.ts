import { SpecialistType } from '@prisma/client';
export declare class CreateSpecialistDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    sex: string;
    password: string;
    documents?: string[];
    avatarUrl?: string;
    type: SpecialistType;
}
