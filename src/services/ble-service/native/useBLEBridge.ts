import { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import {SensorData} from "../../../types/SensorData.ts";

const { BLEBridge } = NativeModules;

export function useBLEBridge() {
    console.log('[BLEBridge] Native module:', BLEBridge);

    const [sensorDataList, setSensorDataList] = useState<SensorData[]>([]);

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

            const formattedData: SensorData = {
                sensorId: macAddress,
                macAddress,
                name: data.name,
                temperature: typeof data.temperature === 'string' ? parseFloat(data.temperature) : null,
                humidity: data.humidity ?? null,
                battery: data.battery ?? null,
                timestamp: Date.now(),
            };

            setSensorDataList((prev) => {
                const last = prev.find((d) => d.macAddress === formattedData.macAddress);

                if (last
                    && last.temperature === formattedData.temperature
                    && last.humidity === formattedData.humidity
                    && last.battery === formattedData.battery
                ) {
                    return prev.map((d) =>
                        d.macAddress === formattedData.macAddress ? { ...d, timestamp: formattedData.timestamp } : d
                    );
                }

                return [...prev, formattedData];
            });
        });

        const errorListener = eventEmitter.addListener('bleError', (error) => {
            console.error('[BLEBridge] Error from native:', error);
        });

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

    return { sensorDataList, rescan };
}

function extractMacAddress(name: string): string | null {
    const macRegex = /([0-9A-F]{2}[:-]){5}([0-9A-F]{2})/i;
    const match = name.match(macRegex);
    return match ? match[0] : null;
}
