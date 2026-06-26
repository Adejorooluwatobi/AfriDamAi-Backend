export declare class PricingPlan {
    id: string;
    name: string;
    type: string;
    price: number;
    durationDays?: number;
    appointmentLimit?: number;
    isInstantSession?: boolean;
    description: string[];
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    paystackPlanCode?: string;
    updatedAt: Date;
    constructor(partial: Partial<PricingPlan>);
}
