import { EnvironmentalReading } from '../../types/EnvironmentalReading.ts';
import { SensorData } from '../../types/SensorData.ts';
import {LocationPreview} from "../../types/Location.ts";
import { v4 as uuidv4 } from 'uuid';

function roundCoord(coord: number, precision = 5) {
    const factor = 10 ** precision;
    return Math.round(coord * factor) / factor;
}

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

    const normalizedLocation = location
        ? {
            ...location,
            latitude: roundCoord(location.latitude, 5),
            longitude: roundCoord(location.longitude, 5),
        }
        : null;

    return {
        readingId: `${sensor.sensorId}-${uuidv4()}`,
        sensorId: sensor.sensorId,
        temperature: sensor.temperature ?? 0,
        humidity: sensor.humidity ?? 0,
        timestamp,
        location: normalizedLocation,
    };
}
