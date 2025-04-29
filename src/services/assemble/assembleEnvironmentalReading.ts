import { EnvironmentalReading } from '../../types/EnvironmentalReading.ts';
import { SensorData } from '../../types/SensorData.ts';

/**
 * Assemble a full EnvironmentalReading from SensorData and optional location.
 * @param sensor SensorData after filtering
 * @param location Latest known geolocation or null
 */
export function assembleEnvironmentalReading(
    sensor: SensorData,
    location: { latitude: number; longitude: number } | null,
    locationTagId?: string
): EnvironmentalReading {
    return {
        readingId: `${sensor.sensorId}-${sensor.timestamp}`,
        sensorId: sensor.sensorId,
        temperature: sensor.temperature ?? 0,
        humidity: sensor.humidity ?? 0,
        battery: sensor.battery ?? null,
        timestamp: sensor.timestamp,
        rawCoordinates: location ? { latitude: location.latitude, longitude: location.longitude } : null,
        locationTagId: locationTagId ?? null,
    };
}
