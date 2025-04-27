import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useBLEBridge } from '../../services/ble-service/native/useBLEBridge.ts';

export default function BleScanScreen() {
    const { sensorDataList, rescan } = useBLEBridge();

    return (
        <View style={styles.container}>
            <FlatList
                data={sensorDataList}
                keyExtractor={(_, index) => index.toString()}
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
