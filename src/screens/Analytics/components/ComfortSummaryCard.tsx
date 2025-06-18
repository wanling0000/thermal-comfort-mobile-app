import React from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function ComfortSummaryCard() {
    return (
        <Card style={styles.card}>
            <Text style={styles.date}>12 Mar 15:34</Text>
            <Text style={styles.emoji}>😊</Text>
            <Text style={styles.label}>Neutral</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#444',
        marginBottom: 16,
        borderRadius: 12,
    },
    date: {
        color: 'white',
        marginBottom: 8,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    label: {
        color: 'white',
        fontSize: 16,
    },
});
