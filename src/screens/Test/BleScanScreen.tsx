import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useBLEBridge } from '../../services/ble-service/native/useBLEBridge.ts';
import { useLocation} from "../../services/location/useLocation.ts";
import dayjs from 'dayjs';
import {reverseGeocode} from "../../services/location/reverseGeocode.ts";

export default function BleScanScreen() {
    const { sensorDataList, lastSeenMap, rescan } = useBLEBridge();
    const { location, setCustomTag } = useLocation();
    const [address, setAddress] = useState<string | null>(null);
    // const { pendingData } = useUploadQueue();

    useEffect(() => {
        if (location) {
            (async () => {
                const result = await reverseGeocode(location.latitude, location.longitude);
                console.log('[BleScanScreen] reverseGeocode result:', result);
                setAddress(result);
            })();
        }
    }, [location]);

    return (
        <View style={styles.container}>
            <FlatList
                data={sensorDataList}
                keyExtractor={(item) => item.sensorId}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>📟 Device: {item.name}</Text>
                        {item.temperature !== null && <Text>🌡️ Temp: {item.temperature} °C</Text>}
                        {item.humidity !== null && <Text>💧 Humidity: {item.humidity}%</Text>}
                        {item.battery !== null && <Text>🔋 Battery: {item.battery}%</Text>}
                        <Text>🕰️ Last seen: {lastSeenMap[item.sensorId] ? dayjs(lastSeenMap[item.sensorId]).format('HH:mm:ss') : 'N/A'}</Text>
                        {location && (
                            <>
                                <Text>📍 Location: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</Text>
                                <Text>🏷️ Address: {address ?? 'Resolving address...'}</Text>
                            </>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text>No devices yet...</Text>}
            />
            <Button
                title="🧪 Print Pending Data"
                // onPress={() => console.log('[ui Trigger] Current Pending Data:', pendingData)}
            />
            <Button title="🔄 Rescan" onPress={rescan} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    item: { marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 10 },
});
