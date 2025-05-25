import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const TemperatureCard = ({
                             temperature,
                             lastSeen,
                         }: {
    temperature: number | null;
    lastSeen?: string;
}) => (
    <Card style={styles.card} mode="contained">
        <Card.Content>
            <Text variant="titleSmall" style={styles.title}>🌡️ Temperature</Text>
            <Text variant="headlineSmall" style={styles.value}>
                {temperature !== null ? `${temperature.toFixed(1)} °C` : 'Loading...'}
            </Text>
            {lastSeen && <Text variant="bodySmall" style={styles.timestamp}>⏱ {lastSeen}</Text>}
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginRight: 8,
        borderRadius: 16,
    },
    title: { marginBottom: 4 },
    value: { textAlign: 'center', marginBottom: 4 },
    timestamp: { textAlign: 'right', color: '#6b7280' },
});

export default TemperatureCard;
