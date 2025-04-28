export type SensorSummary = {
    sensorId: string;      // UUID，数据库主键
    name: string;          // 显示用名字
    macAddress: string;    // BLE唯一识别ID
    type: 'WoIOTH' | 'OtherType';
    lastTemperature: number | null;
    lastHumidity: number | null;
    lastReadingTime: string;
};
