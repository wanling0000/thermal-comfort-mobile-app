import { useEffect, useRef, useState } from 'react';
import { EnvironmentalReading } from '../../types/EnvironmentalReading';
/**
 * 判断两条读数是否“有意义变化”（温度、湿度、位置）
 */
const hasChanged = (a: EnvironmentalReading, b: EnvironmentalReading): boolean => {
    const tempChanged = a.temperature !== b.temperature;
    const humidityChanged = a.humidity !== b.humidity;

    const locationChanged = (() => {
        if (!a.location || !b.location) return a.location !== b.location;

        const R = 6371e3; // 地球半径（米）
        const toRad = (deg: number) => deg * Math.PI / 180;

        const φ1 = toRad(a.location.latitude);
        const φ2 = toRad(b.location.latitude);
        const Δφ = toRad(b.location.latitude - a.location.latitude);
        const Δλ = toRad(b.location.longitude - a.location.longitude);

        const aVal = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
        const distance = R * c;

        return distance > 5;
    })();

    return tempChanged || humidityChanged || locationChanged;
};

/**
 * 缓存池结构：
 * - realtimeBuffer: 保留最近 60 分钟内的数据，用于前端展示
 * - uploadBuffer: 保留从 realtimeBuffer 中转移出的、等待上传的数据
 */
export function useEnvironmentalDataBuffer() {
    const [realtimeBuffer, setRealtimeBuffer] = useState<EnvironmentalReading[]>([]);
    const [uploadBuffer, setUploadBuffer] = useState<EnvironmentalReading[]>([]);
    const realtimeBufferRef = useRef<EnvironmentalReading[]>([]);

    const DISPLAY_WINDOW_MS = 60 * 60 * 1000; // 展示窗口：60分钟 TODO: debug
    const CLEAN_INTERVAL_MS = 5 * 60 * 1000; // 清理+转移频率：5分钟

    // 保证 ref 跟最新 state 同步
    useEffect(() => {
        realtimeBufferRef.current = realtimeBuffer;
    }, [realtimeBuffer]);


    /**
     * 新增一条读数：和当前 buffer 最后一条比对，变化才加入
     */
    const addReading = (reading: EnvironmentalReading) => {
        setRealtimeBuffer(prev => {
            const now = Date.now();
            const oneHourAgo = now - DISPLAY_WINDOW_MS;
            const cleaned = prev.filter(r => r.timestamp >= oneHourAgo);

            const prevReading = cleaned[cleaned.length - 1];
            if (!prevReading || hasChanged(prevReading, reading)) {
                console.log('[AddReading] Added to buffer ✅', reading);
                setUploadBuffer(prevUpload => [...prevUpload, reading]);
                return [...cleaned, reading];
            }

            console.log('[AddReading] Skipped, not changed ❌');
            return cleaned;
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
