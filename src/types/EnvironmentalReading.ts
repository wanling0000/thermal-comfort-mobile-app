export type EnvironmentalReading = {
    readingId: string; // UUID
    sensorId: string;
    temperature: number;
    humidity: number;
    battery?: number | null;
    timestamp: number; // Unix timestamp in milliseconds
    rawCoordinates?: { latitude: number; longitude: number } | null;
    locationTagId?: string | null; // User-defined location tag, optional in early versions
};
