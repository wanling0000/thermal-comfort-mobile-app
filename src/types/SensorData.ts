export type SensorData = {
    // TODO: Use macAddress during MVP phase; replace with registered sensorId in the full version
    sensorId: string;
    macAddress: string; // True unique identifier of the device
    name: string;
    temperature: number | null;
    humidity: number | null;
    battery: number | null;
    timestamp: number;
};
