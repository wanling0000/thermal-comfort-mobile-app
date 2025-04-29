import { request } from '../../utils/request';
import { EnvironmentalReading } from '../../types/EnvironmentalReading';

export const EnvironmentalReadingService = {
    uploadEnvironmentalReadings: async (readings: EnvironmentalReading[]) => {
        if (readings.length === 0) {
            console.warn('[EnvironmentalReadingService] No readings to upload.');
            return;
        }

        return request('/api/v1/readings/upload', {
            method: 'POST',
            body: JSON.stringify({ readings }),
        });
    },

    getLatestSensorData: (sensorId: string) => {
        if (!sensorId) {
            throw new Error('[EnvironmentalReadingService] sensorId is required.');
        }

        return request(`/api/v1/sensors/${sensorId}/latest`, {
            method: 'GET',
        });
    },
};
