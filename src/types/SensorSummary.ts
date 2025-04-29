export type SensorSummary = {
    sensorId: string;      // UUID, primary key in the database
    name: string;          // Display name
    macAddress: string;    // Unique BLE identifier
    type: 'WoIOTH' | 'OtherType';
    lastTemperature: number | null;
    lastHumidity: number | null;
    lastReadingTime: string;
};
