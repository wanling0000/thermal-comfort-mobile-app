import { useEffect, useState } from 'react';

/**
 * 每分钟更新一次，用于驱动基于时间的 UI 更新（如 “上次更新时间”）
 */
export function useMinuteTick(): number {
    const [tick, setTick] = useState(() => Math.floor(Date.now() / 60_000));

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(Math.floor(Date.now() / 60_000));
        }, 60_000); // 每分钟 tick 一下

        return () => clearInterval(interval);
    }, []);

    return tick;
}
