export declare class UserContextDto {
    region?: string;
    country?: string;
    known_skintone_type?: string;
    skin_type_last_time_checked?: string;
    known_skin_condition?: string;
    skin_condition_last_time_checked?: string;
    gender?: string;
    age?: number;
    known_body_lotion?: string;
    known_body_lotion_brand?: string;
    known_allergies?: string[];
    known_last_skin_treatment?: string;
    known_last_consultation_with_afridermatologists?: string;
    user_activeness_on_app?: string;
}
export declare class ChatbotRequestDto {
    query: string;
    more_info?: UserContextDto;
}
export declare class ChatbotResponseDto {
    status: string;
    response: string;
}
