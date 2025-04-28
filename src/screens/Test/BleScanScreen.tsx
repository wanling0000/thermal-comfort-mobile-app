// BleScanScreen.tsx
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useBLE } from '../../services/ble-service/BleProvider.tsx';
import { useDeviceMonitor } from '../../services/ble-service/sensor/DeviceMonitor.tsx'; // 带通知的版本

export default function BleScanScreen() {
    const { sensorDataList, rescan } = useBLE();

    useDeviceMonitor();

    return (
        <View style={styles.container}>
            <FlatList
                data={sensorDataList}
                keyExtractor={(item) => item.macAddress}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>📟 {item.name}</Text>
                        {item.temperature !== null && <Text>🌡️ Temp: {item.temperature} °C</Text>}
                        {item.humidity !== null && <Text>💧 Humidity: {item.humidity}%</Text>}
                        {item.battery !== null && <Text>🔋 Battery: {item.battery}%</Text>}
                    </View>
                )}
                ListEmptyComponent={<Text>No devices yet...</Text>}
            />
            <Button title="🔄 Rescan" onPress={rescan} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    item: { marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 10 },
});
