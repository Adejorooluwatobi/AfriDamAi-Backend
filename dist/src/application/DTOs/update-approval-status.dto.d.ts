export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class UpdateApprovalStatusDto {
    status: ApprovalStatus;
}
