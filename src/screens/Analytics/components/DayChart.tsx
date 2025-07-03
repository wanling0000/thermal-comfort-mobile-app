import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Surface } from 'react-native-paper';

type Feedback = {
    emoji: string;
    notes?: string;
    activity?: string;
};

export type DailyChartPoint = {
    timestamp: number; // milliseconds
    temperature: number;
    humidity: number;
    feedback: Feedback | null;
};

export default function DayChart({ data }: { data: DailyChartPoint[] }) {
    const [selectedPoint, setSelectedPoint] = useState<DailyChartPoint | null>(null);

    const temperatureData = data.map((d) => ({
        x: new Date(d.timestamp),
        y: d.temperature,
        original: d,
    }));

    const humidityData = data.map((d) => ({
        x: new Date(d.timestamp),
        y: d.humidity,
        original: d,
    }));

    return (
        <Surface style={styles.card}>
            <Text style={styles.title}>📊 Daily Temperature & Humidity ({data.length} points)</Text>

            <VictoryChart
                theme={VictoryTheme.clean}
            >
                <VictoryLine
                    interpolation="natural"
                    data={sampleData}
                />
            </VictoryChart>
            <VictoryChart>
                theme={VictoryTheme.material}
                scale={{ x: 'time' }}
                containerComponent={
                    <VictoryVoronoiContainer
                        labels={({ datum }) =>
                            `Time: ${datum.x.getHours()}:00\nTemp: ${datum.original.temperature}°C\nHumidity: ${datum.original.humidity}%${
                                datum.original.feedback
                                    ? `\nFeedback: ${datum.original.feedback.emoji} ${datum.original.feedback.notes || ''}`
                                    : ''
                            }`
                        }
                        labelComponent={
                            <VictoryTooltip
                                cornerRadius={4}
                                flyoutStyle={{ fill: 'white', stroke: '#ddd' }}
                                style={{ fontSize: 12 }}
                            />
                        }
                        onActivated={(points) => {
                            const first = points?.[0]?.original;
                            if (first?.feedback) {
                                setSelectedPoint(first);
                            } else {
                                setSelectedPoint(null);
                            }
                        }}
                    />
                }
            >
                <VictoryAxis
                    tickFormat={(t) => `${new Date(t).getHours()}h`}
                    style={{ tickLabels: { fontSize: 10 } }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(t) => `${t}°`}
                    style={{ tickLabels: { fontSize: 10, fill: 'red' } }}
                />
                <VictoryLine
                    data={temperatureData}
                    style={{ data: { stroke: 'red' } }}
                />
                <VictoryLine
                    data={humidityData}
                    style={{ data: { stroke: 'blue' } }}
                />

                {/* Feedback reference lines */}
                {data
                    .filter((d) => d.feedback)
                    .map((d, idx) => (
                        <VictoryLine
                            key={`ref-${idx}`}
                            data={[
                                { x: new Date(d.timestamp), y: 0 },
                                { x: new Date(d.timestamp), y: 100 },
                            ]}
                            style={{
                                data: {
                                    stroke: 'green',
                                    strokeDasharray: '4,2',
                                    strokeWidth: 1,
                                },
                            }}
                            labels={['📝']}
                            labelComponent={
                                <VictoryLabel
                                    dy={-5}
                                    style={{ fill: 'green', fontSize: 14 }}
                                />
                            }
                        />
                    ))}
            </VictoryChart>

            {selectedPoint?.feedback && (
                <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackText}>
                        {selectedPoint.feedback.emoji} {selectedPoint.feedback.notes}
                    </Text>
                    {selectedPoint.feedback.activity && (
                        <Text style={styles.feedbackText}>Activity: {selectedPoint.feedback.activity}</Text>
                    )}
                </View>
            )}
        </Surface>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 12,
        padding: 12,
        elevation: 2,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
    },
    feedbackBox: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#e0f7e9',
        borderRadius: 8,
    },
    feedbackText: {
        fontSize: 14,
        color: '#2d3436',
    },
});
