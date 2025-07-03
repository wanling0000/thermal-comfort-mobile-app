import {LocationPreview} from "./Location.ts";

export type EnvironmentalReading = {
    readingId: string; // UUID
    sensorId: string;
    temperature: number;
    humidity: number;
    timestamp: number; // Unix timestamp in milliseconds
    location?: LocationPreview | null;
    userId: string;
};
