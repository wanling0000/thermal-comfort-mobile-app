import {EnvironmentalReading} from "./EnvironmentalReading.ts";

export interface BaseFeedbackInput {
    id?: string;
    comfort_level: number;
    feedback_type: 'quick' | 'detailed';
    timestamp: number;
    raw_coordinates: {
        latitude: number;
        longitude: number;
    };
    location_display_name: string;
    is_custom_location?: boolean;
    custom_tag_name?: string;
}

export interface QuickFeedbackInput extends BaseFeedbackInput {
    feedback_type: 'quick';
}

export interface DetailedFeedbackInput extends BaseFeedbackInput {
    feedback_type: 'detailed';
    adjustedTempLevel: number;
    adjustedHumidLevel: number;
    clothingLevel: string;
    activityTypeId: string;
    notes: string;
}


export type FeedbackInput = QuickFeedbackInput | DetailedFeedbackInput;

export interface FeedbackWithReadingInput {
    feedback: FeedbackInput;
    reading: EnvironmentalReading;
}


export interface BaseFeedbackResponse {
    id: string;
    comfort_level: number;
    timestamp: number;
    feedback_type: 'quick' | 'detailed'; // 实际类型中会覆写
    raw_coordinates: {
        latitude: number;
        longitude: number;
    };
    location_display_name: string;
    is_custom_location?: boolean;
    custom_tag_name?: string;
}

export interface FeedbackResponse {
    feedbackId: string;
    comfortLevel: number;
    feedbackType: 'quick' | 'detailed';
    timestamp: number;
    locationDisplayName: string;
    isCustomLocation?: boolean;
    customTagName?: string;
    rawCoordinates: {
        latitude: number;
        longitude: number;
    };
    notes?: string;
    activityTypeId?: string;
    clothingLevel?: string;
    adjustedTempLevel?: number;
    adjustedHumidLevel?: number;
}

