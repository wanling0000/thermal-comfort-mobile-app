import { request } from '../../utils/request';
import { EnvironmentalReading } from '../../types/EnvironmentalReading';

export const SensorService = {
    uploadEnvironmentalReadings: (readings: EnvironmentalReading[]) => {
        return request('/api/v1/readings/upload', {
            method: 'POST',
            body: JSON.stringify({ readings }),
        });
    },

    getLatestSensorData: (sensorId: string) => {
        return request(`/api/v1/sensors/${sensorId}/latest`, {
            method: 'GET',
        });
    },
};
