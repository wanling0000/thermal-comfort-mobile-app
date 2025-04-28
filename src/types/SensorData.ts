export type SensorData = {
    // TODO: MVP阶段使用macAddress，正式版替换为注册sensorId
    sensorId: string;
    macAddress: string; // 设备真实唯一标识
    name: string;       // 显示名，可选
    temperature: number | null;
    humidity: number | null;
    battery: number | null;
    timestamp: number;
};
