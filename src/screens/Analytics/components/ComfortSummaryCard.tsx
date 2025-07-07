import {InsightCardEntity} from "../../../types/analytics.ts";
import {Card, Text} from "react-native-paper";
import { StyleSheet } from "react-native";


export default function ComfortSummaryCard({ insight }: { insight: InsightCardEntity }) {
    const { title, content, type } = insight;
    if (content === undefined) {
        console.warn("InsightCardEntity.value is undefined", insight);
    }


    const getEmoji = () => {
        if (content === "-") return "❔";
        if (type === "COMFORT_LEVEL") return content.split(" ")[0] ?? "😊";
        if (type === "ACTIVITY") return "🏃";
        if (type === "LOCATION") return "📍";
        return "";
    };

    return (
        <Card style={styles.card}>
            <Card.Title title={title} titleNumberOfLines={2} />
            <Card.Content>
                <Text style={styles.value}>
                    {getEmoji()} {content}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 12,
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 4,
    },
});
