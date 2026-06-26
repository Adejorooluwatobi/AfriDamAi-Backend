import { AdminType, VendorStatus, SpecialtyTier, TransactionStatus, SpecialistStatus, AppointmentStatus, ChatMessageType, OrganizationStatus } from '@prisma/client';
import { AnalyzerEntity } from 'src/domain/entities/analyzer.entity';
export type UploadedFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
    filename?: string;
    destination?: string;
    path?: string;
};
export type CreateUserParams = {
    firstName: string;
    lastName: string;
    email: string;
    sex: string;
    nationality?: string;
    isActive?: boolean;
    phoneNo: string;
    password: string;
    refreshToken?: string;
};
export type UpdateUserParams = {
    firstName?: string;
    lastName?: string;
    email?: string;
    sex?: string;
    nationality?: string;
    isActive?: boolean;
    isSuspended?: boolean;
    phoneNo?: string;
    password?: string;
    refreshToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    deletedAt?: Date;
    lastLoginAt?: Date;
    onboardingCompleted?: boolean;
    profile?: UpdateProfileParams;
};
export type CreateAdminParams = {
    username?: string;
    type: AdminType;
    firstName?: string;
    lastName?: string;
    email: string;
    isActive?: boolean;
    phoneNo?: string;
    password: string;
    refreshToken?: string;
    lastLoginAt?: Date;
    organizationId?: string;
};
export type UpdateAdminParams = {
    username?: string;
    type?: AdminType;
    firstName?: string;
    lastName?: string;
    email?: string;
    isActive?: boolean;
    isSuspended?: boolean;
    phoneNo?: string;
    password?: string;
    refreshToken?: string;
    lastLoginAt?: Date;
    organizationId?: string;
};
export type CreateVendorParams = {
    companyName: string;
    rcNumber: string;
    businessAddress: string;
    phoneNumber: string;
    documentsUrl?: string[];
    status: VendorStatus;
    isActive?: boolean;
    password: string;
    refreshToken?: string;
    email: string;
    lastLoginAt?: Date;
};
export type UpdateVendorParams = {
    companyName?: string;
    rcNumber?: string;
    businessAddress?: string;
    phoneNumber?: string;
    documentsUrl?: string[];
    status?: VendorStatus;
    isActive?: boolean;
    isSuspended?: boolean;
    password?: string;
    refreshToken?: string;
    email?: string;
    lastLoginAt?: Date;
};
export type CreateProfileParams = {
    userId: string;
    ageRange?: number;
    skinHistory?: AnalyzerEntity[];
    skinType?: string;
    skinToneLevel?: number;
    knownSkinAllergies?: string[];
    allergies?: string;
    previousTreatments?: string[];
    knownSkinCondition?: string;
    knownBodyLotion?: string;
    knownBodyLotionBrand?: string;
    onboardingSkipped?: boolean;
    melaninTone?: string;
    primaryConcern?: string;
    environment?: string;
    avatarUrl?: string;
    onboardingCompleted?: boolean;
};
export type UpdateProfileParams = {
    userId?: string;
    ageRange?: number;
    skinHistory?: AnalyzerEntity[];
    skinType?: string;
    skinToneLevel?: number;
    knownSkinAllergies?: string[];
    allergies?: string;
    previousTreatments?: string[];
    knownSkinCondition?: string;
    knownBodyLotion?: string;
    knownBodyLotionBrand?: string;
    onboardingSkipped?: boolean;
    melaninTone?: string;
    primaryConcern?: string;
    environment?: string;
    avatarUrl?: string;
    onboardingCompleted?: boolean;
};
export type CreateAnalyzerParams = {
    id?: string;
    userId?: string;
    imageUrl?: string;
    predictions?: Record<string, number>;
    description?: string;
    status?: string;
    label?: string;
    aiImageUrl?: string;
    scanningStatus?: 'initializing' | 'capturing' | 'processing' | 'completed' | 'failed';
    scanningProgress?: number;
};
export type UpdateAnalyzerParams = {
    id?: string;
    userId?: string;
    imageUrl?: string;
    predictions?: Record<string, number>;
    description?: string;
    status?: string;
    label?: string;
    aiImageUrl?: string;
    scanningStatus?: 'initializing' | 'capturing' | 'processing' | 'completed' | 'failed';
    scanningProgress?: number;
};
export type CreateProductParams = {
    name: string;
    slug?: string;
    description?: string | null;
    basePrice: number;
    primaryCategoryId?: string | null;
    secondaryCategoryIds?: string[];
    imageUrl?: string;
    isActive?: boolean;
    stock?: number;
    vendorId: string;
};
export type UpdateProductParams = {
    name?: string;
    slug?: string;
    description?: string | null;
    basePrice?: number;
    primaryCategoryId?: string | null;
    secondaryCategoryIds?: string[];
    imageUrl?: string;
    isActive?: boolean;
    stock?: number;
};
export type CreateCategoryParams = {
    name: string;
    slug?: string;
    description?: string | null;
    parentId?: string | null;
    isActive?: boolean;
};
export type UpdateCategoryParams = {
    name?: string;
    description?: string | null;
    parentId?: string | null;
    isActive?: boolean;
};
export type CreateOrderItemParams = {
    productId: string;
    quantity: number;
    price: number;
    attributes?: {
        attributeId: string;
        valueId: string;
    }[];
};
export type UpdateOrderItemParams = {
    quantity?: number;
    price?: number;
};
export type CreateOrderParams = {
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    items: CreateOrderItemParams[];
};
export type UpdateOrderParams = {
    status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    totalAmount?: number;
    shippingAddress?: string;
};
export type CreateCartParams = {
    userId: string;
};
export type CreateCartItemParams = {
    cartId: string;
    productId: string;
    quantity: number;
};
export type UpdateCartItemParams = {
    quantity: number;
};
export type CreateReviewParams = {
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
};
export type UpdateReviewParams = {
    rating?: number;
    comment?: string;
};
export type CreateWishlistParams = {
    userId: string;
};
export type CreateWishlistItemParams = {
    wishlistId: string;
    productId: string;
};
export type UpdateWishlistItemParams = {
    productId?: string;
};
export type CreateShippingAddressParams = {
    userId: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
    isDefault?: boolean;
};
export type UpdateShippingAddressParams = {
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    isDefault?: boolean;
};
export type CreateCouponParams = {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: Date;
};
export type UpdateCouponParams = {
    code?: string;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: Date;
};
export type CreateAttributeParams = {
    name: string;
    type: string;
    isRequired?: boolean;
};
export type UpdateAttributeParams = {
    name?: string;
    type?: string;
    isRequired?: boolean;
};
export type CreateAttributeValueParams = {
    attributeId: string;
    value: string;
};
export type UpdateAttributeValueParams = {
    value?: string;
};
export type CreateTransactionParams = {
    orderId?: string;
    appointmentId?: string;
    pricingPlanId?: string;
    subscriptionId?: string;
    userId: string;
    amount: number;
    gateway: 'STRIPE' | 'PAYPAL' | 'FLUTTERWAVE' | 'PAYSTACK';
    gatewayTransactionId?: string;
    paymentMethod?: string;
    status?: TransactionStatus;
};
export type UpdateTransactionParams = {
    status?: TransactionStatus;
    gatewayTransactionId?: string;
    paymentMethod?: string;
};
export type CreateProductAttributeParams = {
    productId: string;
    attributeId: string;
    attributeValueId: string;
    stock?: number;
};
export type UpdateProductAttributeParams = {
    stock?: number;
    attributeValueId?: string;
};
export type CreateConsultationParams = {
    name: string;
    email: string;
    phone: string;
    title: string;
    description: string;
};
export type UpdateConsultationParams = {
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
    description?: string;
};
export type CreateAppointmentParams = {
    userId: string;
    subscriptionId?: string;
    specialty: SpecialtyTier;
    type?: string;
    price?: number;
    scheduledAt?: Date;
    notes?: string;
    specialistId?: string;
    organizationId?: string;
};
export type UpdateAppointmentParams = {
    userId?: string;
    subscriptionId?: string;
    specialty?: SpecialtyTier;
    type?: string;
    status?: AppointmentStatus;
    price?: number;
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    notes?: string;
    meetingLink?: string;
    specialistId?: string;
};
export type CreatePricingPlanParams = {
    name: string;
    type: string;
    price: number;
    durationDays?: number;
    appointmentLimit?: number;
    isInstantSession?: boolean;
    description?: string[];
    isActive?: boolean;
    paystackPlanCode?: string;
};
export type UpdatePricingPlanParams = {
    name?: string;
    type?: string;
    price?: number;
    durationDays?: number;
    appointmentLimit?: number;
    isInstantSession?: boolean;
    description?: string[];
    isActive?: boolean;
    paystackPlanCode?: string;
};
export type AiMoreInfo = {
    region: string;
    country: string;
    known_skintone_type: string;
    skin_type_last_time_checked: string;
    known_skin_condition: string;
    skin_condition_last_time_checked: string;
    gender: string;
    age: number;
    known_body_lotion: string;
    known_body_lotion_brand: string;
    known_allergies: string[];
    known_last_skin_treatment: string;
    known_last_consultation_with_afridermatologists: string;
    user_activeness_on_app: string;
};
export interface CreateSubscriptionParams {
    userId: string;
    planId: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    autoRenew?: boolean;
    remainingSessions?: number;
    gatewaySubscriptionId?: string;
}
export interface GrantSubscriptionParams {
    userId: string;
    planId: string;
}
export type CreateSpecialistParams = {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNo: string;
    sex: string;
    documents?: string[];
    type: string;
    status?: SpecialistStatus;
    isActive?: boolean;
    avatarUrl?: string;
    organizationId?: string;
};
export type UpdateSpecialistParams = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNo?: string;
    sex?: string;
    documentsUrl?: string[];
    type?: string;
    status?: SpecialistStatus;
    isActive?: boolean;
    isSuspended?: boolean;
    avatarUrl?: string;
    lastLoginAt?: Date;
    organizationId?: string;
};
export type CreateNotificationParams = {
    userId?: string;
    adminId?: string;
    vendorId?: string;
    specialistId?: string;
    isGeneral?: boolean;
    title: string;
    message: string;
};
export type UpdateNotificationParams = {
    isRead?: boolean;
    isDelivered?: boolean;
    readAt?: Date;
    deliveredAt?: Date;
};
export type CreateChatParams = {
    participant1Id: string;
    participant2Id: string;
};
export type CreateChatMessageParams = {
    chatId: string;
    senderId: string;
    message?: string;
    type?: ChatMessageType;
    attachmentUrl?: string;
    mimeType?: string;
    fileSize?: number;
    duration?: number;
};
export interface UpdateSubscriptionParams {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    autoRenew?: boolean;
    remainingSessions?: number;
    gatewaySubscriptionId?: string;
}
import { WalletOwnerType, WalletTransactionType, WalletRelatedEntityType, WithdrawalStatus } from '@prisma/client';
export type CreateWalletParams = {
    ownerId: string;
    ownerType: WalletOwnerType;
    initialBalance?: number;
};
export type UpdateWalletParams = {
    balance?: number;
};
export type CreateWalletTransactionParams = {
    walletId: string;
    type: WalletTransactionType;
    amount: number;
    description: string;
    relatedEntityId?: string;
    relatedEntityType?: WalletRelatedEntityType;
};
export type CreateWithdrawalRequestParams = {
    walletId: string;
    amount: number;
    requestedById: string;
    requestedByType: WalletOwnerType;
};
export type UpdateWithdrawalRequestParams = {
    status?: WithdrawalStatus;
    approvedById?: string;
    approvedAt?: Date;
    paidAt?: Date;
    adminNotes?: string;
};
export type CreateOrganizationParams = {
    name: string;
    email: string;
    phone: string;
    address?: string;
    logoUrl?: string;
    brandingColors?: any;
    licenseUrl?: string;
    licenseNumber?: string;
    status?: OrganizationStatus;
    isActive?: boolean;
};
export type UpdateOrganizationParams = {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    brandingColors?: any;
    licenseUrl?: string;
    licenseNumber?: string;
    status?: OrganizationStatus;
    isActive?: boolean;
};
export type CreateEmailVerificationParams = {
    email: string;
    code: string;
    payload: any;
    role: string;
    expiresAt: Date;
};
export type UpdateEmailVerificationParams = {
    code?: string;
    payload?: any;
    role?: string;
    expiresAt?: Date;
};
