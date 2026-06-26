import { UserContextDto } from './chatbot.dto';
export declare class IngredientsAnalysisRequestDto {
    query: string;
    more_info?: UserContextDto;
}
export declare class IngredientsAnalysisResponseDto {
    status: string;
    response: string;
}
