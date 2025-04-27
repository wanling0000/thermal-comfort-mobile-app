import { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { BLEBridge } = NativeModules;

type SensorData = {
    name: string;
    temperature: number | null;
    humidity: number | null;
    battery: number | null;
};

export function useBLEBridge() {
    const [sensorDataList, setSensorDataList] = useState<SensorData[]>([]);

    useEffect(() => {
        if (!BLEBridge) {
            console.error('[BLEBridge] Native module not available.');
            return;
        }

        const eventEmitter = new NativeEventEmitter(BLEBridge);

        const deviceListener = eventEmitter.addListener('didFoundDevice', (data) => {
            console.log('[BLEBridge - deviceListener] Received device:', data);
            setSensorDataList((prev) => [...prev, data]);
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

    return { sensorDataList, rescan };
}
