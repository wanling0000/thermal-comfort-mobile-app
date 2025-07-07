import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ComfortChartProps } from '../../../types/analytics.ts';
import DayChart from "./DayChart.tsx";

export default function ComfortChart({ tab, data }: ComfortChartProps) {
    if (!data || data.length === 0) {
        return (
            <View style={styles.chartContainer}>
                <Text>No data available for {tab.toUpperCase()}</Text>
            </View>
        );
    }

    switch (tab) {
        case 'day':
            console.log("ComfortChart:", tab, data);
            return <DayChart data={data} />;

        case 'week':
        case 'month':
        // case 'year':
        //     return <TrendChart data={data} tab={tab} />;
        //
        // case 'heatmap':
        //     return <HeatmapChart data={data} />;

        default:
            return (
                <View style={styles.chartContainer}>
                    <Text>Unsupported tab: {tab}</Text>
                </View>
            );
    }
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
