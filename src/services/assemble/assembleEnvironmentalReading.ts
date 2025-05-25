import { EnvironmentalReading } from '../../types/EnvironmentalReading.ts';
import { SensorData } from '../../types/SensorData.ts';
import {LocationPreview} from "../../types/Location.ts";
import { v4 as uuidv4 } from 'uuid';

/**
 * Assemble a full EnvironmentalReading from SensorData and optional location.
 * @param sensor SensorData after filtering
 * @param location Latest known geolocation or null
 */
export function assembleEnvironmentalReading(
    sensor: SensorData,
    location: LocationPreview | null
): EnvironmentalReading {
    const timestamp = sensor.timestamp;
    const dedupKey = `${sensor.sensorId}-${timestamp}`;

    return {
        readingId: `${dedupKey}-${uuidv4()}`,
        dedupKey,
        sensorId: sensor.sensorId,
        temperature: sensor.temperature ?? 0,
        humidity: sensor.humidity ?? 0,
        timestamp,
        location: location ?? null,
    };
}
