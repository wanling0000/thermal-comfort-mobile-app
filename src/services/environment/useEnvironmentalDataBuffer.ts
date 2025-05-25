import { useEffect, useRef, useState } from 'react';
import { EnvironmentalReading } from '../../types/EnvironmentalReading';

/**
 * 缓存池结构：
 * - realtimeBuffer: 保留最近 60 分钟内的数据，用于前端展示
 * - uploadBuffer: 保留从 realtimeBuffer 中转移出的、等待上传的数据
 */
export function useEnvironmentalDataBuffer() {
    const [realtimeBuffer, setRealtimeBuffer] = useState<EnvironmentalReading[]>([]);
    const [uploadBuffer, setUploadBuffer] = useState<EnvironmentalReading[]>([]);
    const realtimeBufferRef = useRef<EnvironmentalReading[]>([]);

    const DISPLAY_WINDOW_MS = 1 * 60 * 1000; // 展示窗口：60分钟 TODO: debug
    const CLEAN_INTERVAL_MS = 5 * 60 * 1000; // 清理+转移频率：5分钟

    // 保证 ref 跟最新 state 同步
    useEffect(() => {
        realtimeBufferRef.current = realtimeBuffer;
    }, [realtimeBuffer]);

    /**
     * 判断两条读数是否足够不同（避免频繁重复）
     */
    const hasChanged = (a: EnvironmentalReading, b: EnvironmentalReading): boolean => {
        const locationChanged = (() => {
            if (!a.location || !b.location) return a.location !== b.location;
            const latDiff = Math.abs(a.location.latitude - b.location.latitude);
            const lngDiff = Math.abs(a.location.longitude - b.location.longitude);
            const nameDiff = a.location.displayName !== b.location.displayName;
            return latDiff > 0.0001 || lngDiff > 0.0001 || nameDiff;
        })();

        return a.temperature !== b.temperature ||
            a.humidity !== b.humidity ||
            locationChanged;
    };

    /**
     * 新增一条读数：和当前 buffer 最后一条比对，变化才加入
     */
    const addReading = (reading: EnvironmentalReading) => {
        setRealtimeBuffer(prev => {
            // 构建 Map 快速定位已有的 dedupKey → 数据
            const prevMap = new Map(prev.map(r => [r.dedupKey, r]));
            const existing = prevMap.get(reading.dedupKey);

            console.log('[AddReading] New reading:', reading);
            console.log('[AddReading] Existing reading:', existing);

            if (!existing || hasChanged(existing, reading)) {
                console.log('[AddReading] Added to buffer ✅');
                return [...prev, reading];
            }

            console.log('[AddReading] Skipped, not changed ❌');
            return prev;
        });
    };

    /**
     * 定期将展示池中“过期”的读数转移到上传池
     */
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setRealtimeBuffer(prev => {
                const [toUpload, toKeep] = partition(prev, r => r.timestamp < now - DISPLAY_WINDOW_MS);

                if (toUpload.length > 0) {
                    setUploadBuffer(prevUpload => [...prevUpload, ...toUpload]);
                }

                return toKeep;
            });
        }, CLEAN_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []);

    /**
     * 获取并清空上传池：用于上传逻辑
     */
    const flushUploadBuffer = (): EnvironmentalReading[] => {
        const data = [...uploadBuffer];
        setUploadBuffer([]);
        return data;
    };

    return {
        realtimeBuffer,
        uploadBuffer,
        addReading,
        flushUploadBuffer,
    };
}

/**
 * 将数组按条件分为两组：满足条件的一组，剩下的一组
 */
function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];
    for (const item of array) {
        (predicate(item) ? pass : fail).push(item);
    }
    return [pass, fail];
}
