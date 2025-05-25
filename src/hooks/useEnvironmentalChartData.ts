import { useEffect, useState } from 'react';
import { environmentalBuffer } from '../services/environment/environmentalDataBufferSingleton';

export function useEnvironmentalChartData(windowMinutes: number = 60) {
    const [visibleBuffer, setVisibleBuffer] = useState(() => environmentalBuffer.getRealtime());

    useEffect(() => {
        const id = setInterval(() => {
            setVisibleBuffer([...environmentalBuffer.getRealtime()]);
        }, 1000); // 每秒更新一次图表用数据

        return () => clearInterval(id);
    }, []);

    const windowStart = Date.now() - windowMinutes * 60 * 1000;
    const filtered = visibleBuffer.filter(r => r.timestamp >= windowStart);

    return {
        dataPoints: filtered.map(r => ({
            timestamp: r.timestamp,
            temperature: r.temperature ?? null,
            humidity: r.humidity ?? null,
        })),
        stats: { /* 可选，先不管 */ }
    };
}
