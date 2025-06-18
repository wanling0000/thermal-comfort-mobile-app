import React, {useState} from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import ComfortInsightSummary from "./components/ComfortInsightSummary.tsx";
import ComfortChart from "./components/ComfortChart.tsx";
import ComfortSummaryCard from "./components/ComfortSummaryCard.tsx";
import AnalysisTabBar from "./components/AnalysisTabBar.tsx";

export default function AnalyticsScreen() {
    const [selectedTab, setSelectedTab] = useState<'day' | 'week' | 'month' | 'year'>('day');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Analysis</Text>
            <AnalysisTabBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
            <ComfortSummaryCard />
            <ComfortChart tab={selectedTab} />
            <ComfortInsightSummary />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
});
