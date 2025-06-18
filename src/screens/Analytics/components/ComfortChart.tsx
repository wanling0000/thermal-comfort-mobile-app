import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// 这里只做占位，未来可用 Recharts 或 Victory Native 图表库

export default function ComfortChart({ tab }: { tab: string }) {
    return (
        <View style={styles.chartContainer}>
            <Text>📈 Chart Placeholder for {tab.toUpperCase()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        marginBottom: 24,
        borderRadius: 8,
    },
});
