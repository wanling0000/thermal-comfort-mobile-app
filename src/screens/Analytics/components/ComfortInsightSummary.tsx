import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {Button} from "react-native-paper";


export default function ComfortInsightSummary() {
    return (
        <View style={styles.card}>
            <Text style={styles.header}>Summary</Text>
            <Text>✅ Comfortable Temperature Range</Text>
            <Text>Your most comfortable temperature range is 22℃–24℃ based on your past reports.</Text>

            <Text>✅ Weekly Trend Summary</Text>
            <Text>Compared to last week, you reported feeling too warm 30% more often.</Text>

            <Text>✅ Location-Based Comfort Analysis</Text>
            <Text>You feel most comfortable in the University Library.</Text>

            <View style={styles.alertCard}>
                <Text>Would you like to set an alert if room temp exceeds 25℃?</Text>
                <View style={styles.buttonRow}>
                    <Button mode="contained" onPress={() => {}}>Enable alert</Button>
                    <Button mode="outlined" onPress={() => {}}>No, thanks</Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    alertCard: {
        marginTop: 16,
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
