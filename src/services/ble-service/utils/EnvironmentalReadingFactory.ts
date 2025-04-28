import { SensorData } from '../../../types/SensorData.ts';
import { EnvironmentalReading } from '../../../types/EnvironmentalReading.ts';
import { getCurrentLocation } from '../../../utils/geo.ts';
import { v4 as uuidv4 } from 'uuid';
import { log, LogLevel } from '../../../utils/Logger.ts';

/**
 * 从 SensorData 构建完整的 EnvironmentalReading
 * @param sensorData  BLE广播解析后的数据
 * @param sensorId    当前传感器ID（在数据库注册过的）
 * @param locationTagId (可选) 用户选择的地点标签ID
 */
export async function buildEnvironmentalReading(
    sensorData: SensorData,
    sensorId: string,
    locationTagId?: string
): Promise<EnvironmentalReading> {
    try {
        const location = await getCurrentLocation();

        return {
            readingId: uuidv4(),
            sensorId,
            temperature: sensorData.temperature ?? 0,
            humidity: sensorData.humidity ?? 0,
            battery: sensorData.battery ?? null,
            timestamp: Date.now(),
            rawCoordinates: location,
            locationTagId: locationTagId ?? null,
        };
    } catch (error) {
        log('Failed to get location, proceeding without coordinates.', LogLevel.Warn, 'EnvironmentalReadingFactory');

        return {
            readingId: uuidv4(),
            sensorId,
            temperature: sensorData.temperature ?? 0,
            humidity: sensorData.humidity ?? 0,
            battery: sensorData.battery ?? null,
            timestamp: Date.now(),
            rawCoordinates: null,
            locationTagId: locationTagId ?? null,
        };
    }
}
