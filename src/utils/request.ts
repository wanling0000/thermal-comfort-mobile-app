import { AppError } from './AppError';
import { log, LogLevel } from './Logger';
import { apiHostUrl, enableMock } from '../config/api';

export async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${apiHostUrl}${endpoint}`;

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
        log(`Request to ${url} failed: ${error}`, LogLevel.Error, 'Request');
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
