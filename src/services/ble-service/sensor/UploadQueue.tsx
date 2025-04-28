import { useEffect, useRef, useState } from 'react';
import { useBLE } from '../BleProvider';
import { log, LogLevel } from '../../../utils/Logger';
import { AppError } from '../../../utils/AppError';
import { SensorService } from '../../api/SensorService';
import { EnvironmentalReading } from '../../../types/EnvironmentalReading';
import {buildEnvironmentalReading} from "../utils/EnvironmentalReadingFactory.ts";

/**
 * 职责
 * - 收集 BLE 广播数据并缓存
 * - 定时批量上传
 * - 失败后指数退避重试
 * - 支持掉线设备检测（TODO）
 */

const UPLOAD_INTERVAL = 5 * 60 * 1000; // 5分钟
const MAX_RETRY_INTERVAL = 15 * 60 * 1000; // 最多退避到15分钟

export function useUploadQueue() {
    const { sensorDataList } = useBLE();
    const [pendingData, setPendingData] = useState<EnvironmentalReading[]>([]);
    const retryIntervalRef = useRef(UPLOAD_INTERVAL);

    // 收集新的读数
    useEffect(() => {
        if (sensorDataList.length === 0) return;

        const buildReadings = async () => {
            const readings: EnvironmentalReading[] = [];

            for (const sensorData of sensorDataList) {
                // MVP阶段：直接用 sensorData.sensorId（实际上是 macAddress）
                const reading = await buildEnvironmentalReading(sensorData, sensorData.sensorId);
                readings.push(reading);
            }

            setPendingData((prev) => [...prev, ...readings]);
        };

        buildReadings();
    }, [sensorDataList]);

    // 定时上传逻辑
    useEffect(() => {
        if (pendingData.length === 0) return;

        const tryUpload = async () => {
            try {
                log(`Uploading ${pendingData.length} items...`, LogLevel.Info, 'UploadQueue');
                await SensorService.uploadEnvironmentalReadings(pendingData);
                log('Upload success. Clearing pending data.', LogLevel.Info, 'UploadQueue');
                setPendingData([]); // 清空上传成功的数据
                retryIntervalRef.current = UPLOAD_INTERVAL; // 恢复正常上传间隔
            } catch (error) {
                const err = new AppError('Upload failed', 'UPLOAD_FAILED', error);
                log(err.message, LogLevel.Error, 'UploadQueue');

                // 失败指数退避
                retryIntervalRef.current = Math.min(retryIntervalRef.current * 2, MAX_RETRY_INTERVAL);
                log(`Retry scheduled after ${retryIntervalRef.current / 1000}s`, LogLevel.Warn, 'UploadQueue');

                setTimeout(tryUpload, retryIntervalRef.current);
            }
        };

        const uploadTimer = setInterval(tryUpload, UPLOAD_INTERVAL);

        return () => clearInterval(uploadTimer);
    }, [pendingData]);

    return { pendingData };
}
