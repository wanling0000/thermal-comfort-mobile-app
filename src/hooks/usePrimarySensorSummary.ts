import { useMemo } from 'react';
import dayjs from 'dayjs';
import {useBLEBridge} from "../services/ble-service/native/useBLEBridge.ts";
import {SensorData} from "../types/SensorData.ts";
import {environmentalBuffer} from "../services/environment/environmentalDataBufferSingleton.ts";

type Summary = {
    sensorId: string;
    name?: string;
    macAddress?: string;
    type: string;
    lastTemperature: number | null;
    lastHumidity: number | null;
    lastReadingTimestamp: number | null;
    lastReadingTime: string;
    isFresh: boolean;
};

type PrimarySensor = {
    sensorId: string;
    macAddress: string;
    name: string;
    battery: number | null;
    temperature: number | null;
    humidity: number | null;
    timestamp: number;
};

type UsePrimarySensorSummaryReturn = {
    summary: Summary | null;
    primarySensor: PrimarySensor | null;
    sensorDataList: SensorData[]; // ✅ 明确不会 undefined
};

/**
 * 使用原始 BLE 数据或从缓存 buffer 中取最后一条数据。
 * 当前模式：实时 BLE 数据优先（可切换为 'buffer' 模式）。
 */
export function usePrimarySensorSummary(mode: 'ble' | 'buffer' = 'ble'): UsePrimarySensorSummaryReturn {
    const { sensorDataList, lastSeenMap } = useBLEBridge();
    const realtimeBuffer = environmentalBuffer.getRealtime();

    const minuteKey = Math.floor(Date.now() / 60_000);

    return useMemo(() => {
        if (mode === 'buffer') {
            const last = realtimeBuffer[realtimeBuffer.length - 1];
            if (!last) {
                return {
                    summary: null,
                    primarySensor: null,
                    sensorDataList,
                };
            }

            // 通过 sensorId 找回 BLE 原始数据
            const match = sensorDataList.find(s => s.sensorId === last.sensorId);

            return {
                summary: {
                    sensorId: last.sensorId ?? '',
                    type: 'WoIOTH',
                    lastTemperature: last.temperature ?? null,
                    lastHumidity: last.humidity ?? null,
                    lastReadingTimestamp: last.timestamp,
                    lastReadingTime: dayjs(last.timestamp).format('HH:mm:ss'),
                    isFresh: Date.now() - last.timestamp < 60_000,
                },
                primarySensor: {
                    sensorId: last.sensorId ?? '',
                    temperature: last.temperature,
                    humidity: last.humidity,
                    timestamp: last.timestamp,
                    macAddress: match?.macAddress ?? '',
                    name: match?.name ?? '',
                    battery: match?.battery ?? null,
                },
                sensorDataList,
            };
        }

        // fallback: ble mode (原始模式)
        const primary = sensorDataList.length > 0 ? sensorDataList[0] : null;
        if (!primary) {
            return {
                summary: null,
                primarySensor: null,
                sensorDataList,
            };
        }

        const lastTimestamp = lastSeenMap[primary.sensorId];
        const isFresh = !!lastTimestamp && Date.now() - lastTimestamp < 60_000;

        return {
            summary: {
                sensorId: primary.sensorId,
                name: primary.name,
                macAddress: primary.macAddress,
                type: 'WoIOTH',
                lastTemperature: isFresh ? primary.temperature ?? null : null,
                lastHumidity: isFresh ? primary.humidity ?? null : null,
                lastReadingTimestamp: isFresh ? primary.timestamp : null,
                lastReadingTime: lastTimestamp
                    ? dayjs(lastTimestamp).format('HH:mm:ss')
                    : '',
                isFresh,
            },
            primarySensor: primary,
            sensorDataList,
        };
    }, [mode, sensorDataList, lastSeenMap, realtimeBuffer, minuteKey]);
}
