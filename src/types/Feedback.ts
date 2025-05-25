import {EnvironmentalReading} from "./EnvironmentalReading.ts";

export interface QuickFeedbackInput {
    comfort_level: number; // -2 to 2
    feedback_type: 'quick';
    timestamp: number;
    raw_coordinates: {
        latitude: number;
        longitude: number;
    };
    location_display_name: string;     // 地点名（无论是否自定义）
    is_custom_location?: boolean;      // 是否自定义
    custom_tag_name?: string;          // 自定义标签名（可选）
}

export interface FeedbackWithReadingInput {
    feedback: QuickFeedbackInput;
    reading: EnvironmentalReading;
}
