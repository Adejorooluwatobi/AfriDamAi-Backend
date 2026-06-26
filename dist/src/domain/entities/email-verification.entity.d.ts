export declare class EmailVerificationEntity {
    id: string;
    email: string;
    code: string;
    payload: any;
    role: string;
    expiresAt: Date;
    createdAt: Date;
    constructor(partial: Partial<EmailVerificationEntity>);
}
