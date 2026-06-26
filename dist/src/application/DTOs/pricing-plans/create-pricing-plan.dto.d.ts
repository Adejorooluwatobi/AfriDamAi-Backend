export declare class CreatePricingPlanDto {
    name: string;
    type: string;
    price: number;
    durationDays?: number;
    appointmentLimit?: number;
    isInstantSession?: boolean;
    paystackPlanCode?: string;
    description?: string[];
    isActive?: boolean;
}
