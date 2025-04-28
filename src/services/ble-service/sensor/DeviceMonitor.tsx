import { useEffect } from 'react';
import { useBLE } from '../BleProvider.tsx';
import { useNotification } from '../../../contexts/NotificationContext.tsx';
import { log, LogLevel } from '../../../utils/Logger.ts';

const DEVICE_TIMEOUT = 60 * 60 * 1000; // 60分钟

export function useDeviceMonitor() {
    const { sensorDataList } = useBLE();
    const { notify } = useNotification();

    useEffect(() => {
        const interval = setInterval(() => {
            try {
                const now = Date.now();
                const offlineDevices = sensorDataList.filter(device => now - device.timestamp > DEVICE_TIMEOUT);

                if (offlineDevices.length > 0) {
                    const names = offlineDevices.map(d => d.name || d.macAddress).join(', ');
                    log(`Offline devices detected: ${names}`, LogLevel.Warn, 'DeviceMonitor');
                    notify(`Device(s) offline:\n${names}`, 'Device Offline');
                }
            } catch (error) {
                log('Error in device monitor.', LogLevel.Error, 'DeviceMonitor');
            }
        }, 10 * 60 * 1000); // 每10分钟检测一次

        return () => clearInterval(interval);
    }, [notify, sensorDataList]);
}
