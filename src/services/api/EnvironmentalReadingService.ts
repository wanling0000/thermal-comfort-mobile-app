import { request } from '../../utils/request';
import { EnvironmentalReading } from '../../types/EnvironmentalReading';

export const EnvironmentalReadingService = {
    uploadEnvironmentalReadings: async (readings: EnvironmentalReading[], userId: string) => {
        if (readings.length === 0) {
            console.warn('[EnvironmentalReadingService] No readings to environment.');
            return;
        }

        const payload = readings.map(r => ({ ...r, userId }));

        return request('/api/v1/readings/upload', {
            method: 'POST',
            body: JSON.stringify(payload),
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
