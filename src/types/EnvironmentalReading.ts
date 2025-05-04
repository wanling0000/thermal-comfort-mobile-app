import {LocationPreview} from "./Location.ts";

export type EnvironmentalReading = {
    readingId: string; // UUID
    sensorId: string;
    temperature: number;
    humidity: number;
    battery?: number | null;
    timestamp: number; // Unix timestamp in milliseconds
    location?: LocationPreview | null;
};
