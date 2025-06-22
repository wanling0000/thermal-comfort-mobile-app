import React, {useEffect, useState} from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import {FeedbackService} from "../../../services/api/FeedbackService.ts";
import {FeedbackInput} from "../../../types/Feedback.ts";

const emojiMap = {
    '-2': '🥶',
    '-1': '😟',
    '0': '😊',
    '1': '🥵',
    '2': '🔥',
};

const labelMap = {
    '-2': 'Very Cold',
    '-1': 'Cold',
    '0': 'Neutral',
    '1': 'Warm',
    '2': 'Hot',
};

export default function ComfortSummaryCard() {
    const [latestFeedback, setLatestFeedback] = useState<FeedbackInput | null>(null);

    useEffect(() => {
        const fetchLatest = async () => {
            const res = await FeedbackService.getLatestFeedback();
            setLatestFeedback(res);
        };
        fetchLatest();
    }, []);

    if (!latestFeedback) return null;

    const dateStr = new Date(latestFeedback.timestamp).toLocaleString();
    const level = String(latestFeedback.comfort_level);

    return (
        <Card style={styles.card}>
            <Text style={styles.date}>{dateStr}</Text>
            <Text style={styles.emoji}>{emojiMap[level]}</Text>
            <Text style={styles.label}>{labelMap[level]}</Text>
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
