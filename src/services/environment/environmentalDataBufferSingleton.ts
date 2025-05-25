import { EnvironmentalReading } from '../../types/EnvironmentalReading';

let realtimeBuffer: EnvironmentalReading[] = [];
let uploadBuffer: EnvironmentalReading[] = [];

function hasChanged(prev: EnvironmentalReading, next: EnvironmentalReading): boolean {
    const tempChanged = prev.temperature !== next.temperature;
    const humidityChanged = prev.humidity !== next.humidity;

    const locationChanged = (() => {
        if (!prev.location || !next.location) return prev.location !== next.location;

        const R = 6371e3;
        const toRad = (deg: number) => deg * Math.PI / 180;

        const φ1 = toRad(prev.location.latitude);
        const φ2 = toRad(next.location.latitude);
        const Δφ = toRad(next.location.latitude - prev.location.latitude);
        const Δλ = toRad(next.location.longitude - prev.location.longitude);

        const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance > 5;
    })();

    return tempChanged || humidityChanged || locationChanged;
}

export const environmentalBuffer = {
    getRealtime: () => realtimeBuffer,
    getUpload: () => uploadBuffer,

    addReading: (reading: EnvironmentalReading) => {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;

        // 清除超时数据（滑动窗口）
        realtimeBuffer = realtimeBuffer.filter(r => r.timestamp >= oneHourAgo);

        const prev = realtimeBuffer[realtimeBuffer.length - 1];
        if (!prev || hasChanged(prev, reading)) {
            console.log('[GlobalBuffer] Added reading ✅', reading);
            realtimeBuffer.push(reading);
            uploadBuffer.push(reading);
        } else {
            console.log('[GlobalBuffer] Skipped reading ❌', reading);
        }
    },

    flushUpload: () => {
        const now = Date.now();
        const threshold = now - 60_000;

        const toUpload = uploadBuffer.filter(r => r.timestamp < threshold);
        uploadBuffer = uploadBuffer.filter(r => r.timestamp >= threshold);

        console.log(`[GlobalBuffer] ⬆️ Prepared ${toUpload.length} readings for upload`);
        return toUpload;
    },

    removeReadingsById: (readingIds: string[]) => {
        const idSet = new Set(readingIds);
        const before = realtimeBuffer.length;
        realtimeBuffer = realtimeBuffer.filter(r => !idSet.has(r.readingId));
        console.log(`[GlobalBuffer] 🔥 Removed ${before - realtimeBuffer.length} readings from realtimeBuffer`);
    },

    clearRealtime: () => {
        realtimeBuffer = [];
        console.log('[GlobalBuffer] 💨 Cleared realtime buffer');
    }
};
