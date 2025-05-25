import {LocationPreview} from "./Location.ts";

export type EnvironmentalReading = {
    readingId: string; // UUID
    dedupKey: string;
    sensorId: string;
    temperature: number;
    humidity: number;
    timestamp: number; // Unix timestamp in milliseconds
    location?: LocationPreview | null;
};
