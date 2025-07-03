import { Card, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import {InsightCardEntity} from "../../../types/analytics.ts";

export function InsightCard({ insight }: { insight: InsightCardEntity }) {
    return (
        <Card style={styles.card}>
            <Card.Title title={insight.title} />
            <Card.Content>
                <Text style={styles.valueText}>{insight.value}</Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 6,
        marginHorizontal: 12,
        borderRadius: 12,
    },
    valueText: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 4,
    },
});
