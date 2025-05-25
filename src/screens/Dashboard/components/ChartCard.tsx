import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useEnvironmentalChartData } from '../../../hooks/useEnvironmentalChartData';

const screenWidth = Dimensions.get('window').width;

export default function ChartCard() {
    const { dataPoints } = useEnvironmentalChartData(60); // Last 60 minutes

    if (dataPoints.length === 0) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Environmental Trend</Text>
                <Text style={styles.placeholder}>No data yet.</Text>
            </View>
        );
    }

    const labels = dataPoints.map((dp, idx) => {
        const date = new Date(dp.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return idx % 6 === 0 ? timeStr : '';
    });

    const commonChartConfig = {
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 1,
        fromZero: true,
        withInnerLines: false,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: () => '#555',
        style: { borderRadius: 8 },
        propsForDots: {
            r: '2',
            strokeWidth: '1',
            stroke: '#888',
        },
    };

    return (
        <View style={styles.card}>
            <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
                <Text style={styles.title}>Temperature (°C)</Text>
            </View>
            <View style={styles.chartWrapper}>
                <LineChart
                    data={{
                        labels,
                        datasets: [{
                            data: dataPoints.map(d => d.temperature ?? 0),
                            color: () => 'rgba(255, 99, 132, 1)', // red
                            strokeWidth: 2,
                        }],
                    }}
                    width={screenWidth - 32}
                    height={180}
                    chartConfig={commonChartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            <View style={{ paddingHorizontal: 12 }}>
                <Text style={styles.title}>Humidity (%)</Text>
            </View>
            <View style={styles.chartWrapper}>
                <LineChart
                    data={{
                        labels,
                        datasets: [{
                            data: dataPoints.map(d => d.humidity ?? 0),
                            color: () => 'rgba(54, 162, 235, 1)', // blue
                            strokeWidth: 2,
                        }],
                    }}
                    width={screenWidth - 32}
                    height={180}
                    chartConfig={commonChartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    placeholder: {
        color: '#999',
        fontSize: 14,
    },
    chartWrapper: {
        borderRadius: 8,
        overflow: 'hidden', // ✅ 裁掉 LineChart 超出部分
    },
    chart: {
        marginVertical: 4,
        borderRadius: 8,
        marginRight: -12, // ✅ 把 bezier 尾部拉回来
    },
});
