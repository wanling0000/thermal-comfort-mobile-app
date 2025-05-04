import { useBLEBridge } from "../ble-service/native/useBLEBridge.ts";
import { useLocation } from "../location/useLocation.ts";
import { useEffect, useRef, useState } from "react";
import { EnvironmentalReading } from "../../types/EnvironmentalReading.ts";
import { assembleEnvironmentalReading } from "../assemble/assembleEnvironmentalReading.ts";
import { log, LogLevel } from "../../utils/Logger.ts";
import { AppError } from "../../utils/AppError.ts";
import { EnvironmentalReadingService } from "../api/EnvironmentalReadingService.ts";
import {LocationPreview} from "../../types/Location.ts";

/**
 * Responsibilities:
 * - Collect EnvironmentalReading data and cache it
 * - Periodically upload in batches
 * - Retry with exponential backoff on failure
 * - Support offline device detection (TODO)
 */

// const UPLOAD_INTERVAL = 5 * 60 * 1000; // 5 minutes
const UPLOAD_INTERVAL = 10000; // 10 seconds for testing
const MAX_RETRY_INTERVAL = 15 * 60 * 1000; // Max backoff to 15 minutes
const DEBUG_UPLOAD = true;

export function useUploadQueue() {
    const { sensorDataList } = useBLEBridge();
    const location: LocationPreview | null = useLocation();
    const [pendingData, setPendingData] = useState<EnvironmentalReading[]>([]);
    const retryIntervalRef = useRef(UPLOAD_INTERVAL);

    // Collect new data
    useEffect(() => {
        if (sensorDataList.length === 0) return;

        const newReadings = sensorDataList.map((sensor) =>
            assembleEnvironmentalReading(sensor, location)
        );

        setPendingData((prev) => {
            const existingIds = new Set(prev.map((r) => r.readingId));
            const deduped = newReadings.filter((r) => !existingIds.has(r.readingId));

            if (deduped.length > 0) {
                console.log(`[UploadQueue] Added ${deduped.length} new readings.`);
            }

            return [...prev, ...deduped];
        });
    }, [sensorDataList, location]);

    // Periodic upload
    useEffect(() => {
        if (pendingData.length === 0) return;

        const tryUpload = async () => {
            try {
                console.log('[UploadQueue] tryUpload triggered, pendingData length =', pendingData.length);

                if (DEBUG_UPLOAD) {
                    console.log('[DEBUG MODE] Simulated upload payload:', JSON.stringify(pendingData, null, 2));
                    setPendingData([]);
                    return;
                }

                log(`Uploading ${pendingData.length} items...`, LogLevel.Info, 'UploadQueue');
                const res = await EnvironmentalReadingService.uploadEnvironmentalReadings(pendingData);
                console.log('[Upload Result]', res);

                log('Upload success. Clearing pending data.', LogLevel.Info, 'UploadQueue');
                setPendingData([]); // Clear data after successful upload
                retryIntervalRef.current = UPLOAD_INTERVAL; // Reset to normal interval
            } catch (error) {
                const err = new AppError('Upload failed', 'UPLOAD_FAILED', error);
                log(err.message, LogLevel.Error, 'UploadQueue');

                // Exponential backoff on failure
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
