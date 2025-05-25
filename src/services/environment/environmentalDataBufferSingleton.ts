import { EnvironmentalReading } from '../../types/EnvironmentalReading';

let realtimeBuffer: EnvironmentalReading[] = [];
let uploadBuffer: EnvironmentalReading[] = [];

export const environmentalBuffer = {
    getRealtime: () => realtimeBuffer,
    getUpload: () => uploadBuffer,

    addReading: (reading: EnvironmentalReading) => {
        const existing = realtimeBuffer.find(r => r.dedupKey === reading.dedupKey);
        if (!existing || JSON.stringify(existing) !== JSON.stringify(reading)) {
            console.log('[GlobalBuffer] Added reading ✅', reading);
            realtimeBuffer.push(reading);
        } else {
            console.log('[GlobalBuffer] Skipped reading ❌');
        }
    },

    flushUpload: () => {
        const flushed = [...uploadBuffer];
        uploadBuffer = [];
        return flushed;
    },

    removeReadingsById: (readingIds: string[]) => {
        const idSet = new Set(readingIds);
        const before = realtimeBuffer.length;
        realtimeBuffer = realtimeBuffer.filter(r => !idSet.has(r.readingId));
        console.log(`[GlobalBuffer] 🔥 Removed ${before - realtimeBuffer.length} readings from realtimeBuffer`);
    },

    clearRealtime: () => {
        realtimeBuffer = [];
    },
};
