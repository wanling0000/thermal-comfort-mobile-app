import React, { createContext, useContext } from 'react';
import { useBLEBridge } from './native/useBLEBridge';
import {SensorData} from "../../types/SensorData.ts";

type BleContextType = {
    sensorDataList: SensorData[];
    rescan: () => void;
};

const BleContext = createContext<BleContextType>({
    sensorDataList: [],
    rescan: () => {},
});

export function BleProvider({ children }: { children: React.ReactNode }) {
    const { sensorDataList, rescan } = useBLEBridge();

    return (
        <BleContext.Provider value={{ sensorDataList, rescan }}>
            {children}
        </BleContext.Provider>
    );
}

export function useBLE() {
    return useContext(BleContext);
}
