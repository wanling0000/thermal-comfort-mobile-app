import { EnvironmentalReading } from '../../types/EnvironmentalReading.ts';
import { SensorData } from '../../types/SensorData.ts';
import {LocationPreview} from "../../types/Location.ts";

/**
 * Assemble a full EnvironmentalReading from SensorData and optional location.
 * @param sensor SensorData after filtering
 * @param location Latest known geolocation or null
 */
export function assembleEnvironmentalReading(
    sensor: SensorData,
    location: LocationPreview | null
): EnvironmentalReading {
    return {
        readingId: `${sensor.sensorId}-${sensor.timestamp}`,
        sensorId: sensor.sensorId,
        temperature: sensor.temperature ?? 0,
        humidity: sensor.humidity ?? 0,
        battery: sensor.battery ?? null,
        timestamp: sensor.timestamp,
        location: location ?? null,
    };
}
