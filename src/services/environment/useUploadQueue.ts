import { useBLEBridge } from "../ble-service/native/useBLEBridge.ts";
import { useLocation } from "../location/useLocation.ts";
import { useEffect, useRef } from "react";
import { assembleEnvironmentalReading } from "../assemble/assembleEnvironmentalReading.ts";
import { log, LogLevel } from "../../utils/Logger.ts";
import { AppError } from "../../utils/AppError.ts";
import { EnvironmentalReadingService } from "../api/EnvironmentalReadingService.ts";
import {environmentalBuffer} from "./environmentalDataBufferSingleton.ts";

/**
 * Responsibilities:
 * - Collect EnvironmentalReading data and cache it
 * - Periodically environment in batches
 * - Retry with exponential backoff on failure
 * - Support offline device detection (TODO)
 */

const UPLOAD_INTERVAL = 1 * 60 * 1000; // 5 minutes
// const UPLOAD_INTERVAL = 10000; // 10 seconds for testing
const MAX_RETRY_INTERVAL = 15 * 60 * 1000; // Max backoff to 15 minutes
// const DEBUG_UPLOAD = true;
const DEBUG_UPLOAD = false;

export function useUploadQueue() {
    const { sensorDataList } = useBLEBridge();
    const { location } = useLocation();
    const retryIntervalRef = useRef(UPLOAD_INTERVAL);

    // ✅ 每次 BLE 扫描更新，将数据喂入全局 buffer
    useEffect(() => {
        if (sensorDataList.length === 0 || !location) return;

        const newReadings = sensorDataList.map(sensor =>
            assembleEnvironmentalReading(sensor, location)
        );

        newReadings.forEach(reading => {
            console.log('[UploadQueue] ➕ Add reading to buffer:', reading);
            environmentalBuffer.addReading(reading);
        });
    }, [sensorDataList, location]);

    // ✅ 定时尝试上传
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const scheduleNext = () => {
            timeoutId = setTimeout(tryUpload, retryIntervalRef.current);
        };

        const tryUpload = async () => {
            const now = Date.now();
            const uploadThreshold = now - 60_000; // ✅ 读数超过 1 分钟才上传

            const toUpload = environmentalBuffer.getRealtime().filter(
                r => r.timestamp < uploadThreshold
            );

            if (toUpload.length === 0) {
                console.log('[UploadQueue] 🚫 Nothing to upload, try again later');
                scheduleNext();
                return;
            }

            try {
                console.log('[UploadQueue] ⏫ Uploading payload:', JSON.stringify(toUpload, null, 2));
                console.log('[UploadQueue] ⏰ Next upload in', retryIntervalRef.current / 1000, 'seconds');

                if (!DEBUG_UPLOAD) {
                    await EnvironmentalReadingService.uploadEnvironmentalReadings(toUpload);
                    environmentalBuffer.removeReadingsById(toUpload.map(r => r.readingId));
                }

                retryIntervalRef.current = UPLOAD_INTERVAL;
                console.log('[UploadQueue] ✅ Upload successful');
            } catch (error) {
                const err = new AppError('Upload failed', 'UPLOAD_FAILED', error);
                console.error('[Upload Failed]', err);
                retryIntervalRef.current = Math.min(retryIntervalRef.current * 2, MAX_RETRY_INTERVAL);
                log(`Retry after ${retryIntervalRef.current / 1000}s`, LogLevel.Warn, 'UploadQueue');
            }

            scheduleNext();
        };

        scheduleNext();
        return () => clearTimeout(timeoutId);
    }, []);

    return {};
}
