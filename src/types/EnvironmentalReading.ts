export type EnvironmentalReading = {
    readingId: string; // UUID
    sensorId: string;
    temperature: number;
    humidity: number;
    battery?: number | null;
    timestamp: number; // Unix毫秒
    rawCoordinates?: { latitude: number; longitude: number } | null;
    locationTagId?: string | null; // 用户打的标签，初期可选
};
