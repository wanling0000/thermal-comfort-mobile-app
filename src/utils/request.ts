import { AppError } from './AppError';
import { log, LogLevel } from './Logger';
import { apiHostUrl } from '../config/api';

const MOCK_API = true; // ✅ 以后可以用环境变量控制，比如 process.env.MOCK_API

export async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${apiHostUrl}${endpoint}`;

    if (MOCK_API) {
        console.warn(`[MOCK] Request intercepted: ${endpoint}`);

        if (endpoint === '/api/v1/readings/upload' && options.method === 'POST') {
            console.warn(`[MOCK] Simulating successful upload.`);
            return { success: true };
        }

        if (endpoint.startsWith('/api/v1/sensors/') && options.method === 'GET') {
            const sensorId = endpoint.split('/').slice(-2, -1)[0]; // 提取 sensorId
            return {
                sensorId,
                temperature: 24.5,
                humidity: 60,
                battery: 85,
                timestamp: Date.now(),
            };
        }

        console.warn(`[MOCK] No specific mock for ${endpoint}, returning empty.`);
        return {};
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new AppError(
                data?.info || 'Request failed',
                `HTTP_${response.status}`,
                data
            );
        }

        return data;
    } catch (error) {
        log(`Request to ${endpoint} failed: ${error}`, LogLevel.Error, 'Request');
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Network Error', 'NETWORK_ERROR', error);
    }
}

export const api = {
    get: (endpoint: string) => request(endpoint),
    post: (endpoint: string, body: any) =>
        request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),
};
