import { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import {SensorData} from "../../../types/SensorData";

const { BLEBridge } = NativeModules;

export function useBLEBridge() {
    const [sensorDataList, setSensorDataList] = useState<SensorData[]>([]);
    const [lastSeenMap, setLastSeenMap] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!BLEBridge) {
            console.error('[BLEBridge] Native module not available.');
            return;
        }

        const eventEmitter = new NativeEventEmitter(BLEBridge);

        const deviceListener = eventEmitter.addListener('didFoundDevice', (data) => {
            console.log('[BLEBridge - deviceListener] Received device:', data);
            const macAddress = extractMacAddress(data.name);
            if (!macAddress) {
                console.warn('[BLEBridge] Could not extract mac address from:', data.name);
                return;
            }

            const now = Date.now();

            const formattedData: SensorData = {
                sensorId: macAddress,
                macAddress,
                name: data.name,
                temperature: typeof data.temperature === 'string' ? parseFloat(data.temperature) : null,
                humidity: data.humidity ?? null,
                battery: data.battery ?? null,
                timestamp: now,
            };
            setSensorDataList((prev) => {
                const exists = prev.find((d) => d.sensorId === formattedData.sensorId);

                if (exists) {
                    const hasChanged =
                        exists.temperature !== formattedData.temperature ||
                        exists.humidity !== formattedData.humidity ||
                        exists.battery !== formattedData.battery;

                    if (!hasChanged) {
                        return prev; // 数据没变，就不更新，不触发 useEffect
                    }

                    return prev.map((d) =>
                        d.sensorId === formattedData.sensorId ? formattedData : d
                    );
                } else {
                    return [...prev, formattedData];
                }
            });


            setLastSeenMap((prev) => ({
                ...prev,
                [macAddress]: now,
            }));
        });

        const errorListener = eventEmitter.addListener('bleError', (error) => {
            console.error('[BLEBridge - errorListener] Error from native:', error);
        });

        // Start BLE scanning with a small delay
        const startScanTimeout = setTimeout(() => {
            console.log('[BLEBridge - startScanTimeout] Start scanning...');
            BLEBridge?.startScan?.();
        }, 500);

        return () => {
            console.log('[BLEBridge] Cleaning up listeners and stopping scan');
            clearTimeout(startScanTimeout);
            deviceListener.remove();
            errorListener.remove();
            BLEBridge?.stopScan?.();
        };
    }, []);

    const rescan = () => {
        console.log('[BLEBridge - rescan] Rescanning...');
        setSensorDataList([]);
        BLEBridge?.startScan?.();
    };

    return { sensorDataList, lastSeenMap, rescan };
}

export function extractMacAddress(name: string): string | null {
    const macRegex = /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/i;
    const match = name.match(macRegex);
    return match ? match[0] : null;
}
