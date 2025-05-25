import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

const HumidityCard = ({
                          humidity,
                          lastSeen,
                      }: {
    humidity: number | null;
    lastSeen?: string;
}) => (
    <Card style={styles.card} mode="contained">
        <Card.Content>
            <Text variant="titleSmall" style={styles.title}>💧 Humidity</Text>
            <Text variant="headlineSmall" style={styles.value}>
                {humidity !== null ? `${humidity.toFixed(0)} %` : 'Loading...'}
            </Text>
            {lastSeen && (
                <Text variant="bodySmall" style={styles.timestamp}>
                    ⏱ {lastSeen}
                </Text>
            )}
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginLeft: 8,
        borderRadius: 16,
    },
    title: {
        marginBottom: 4,
    },
    value: {
        marginBottom: 4,
        textAlign: 'center',
    },
    timestamp: {
        textAlign: 'right',
        color: '#6b7280', // hint-like gray
    },
});

export default HumidityCard;
