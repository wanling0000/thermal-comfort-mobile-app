import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ComfortInsightSummary from './components/ComfortInsightSummary';
import ComfortChart from './components/ComfortChart';
import ComfortSummaryCard from './components/ComfortSummaryCard';
import AnalysisTabBar from './components/AnalysisTabBar'; // 你的小号 SegmentedButtons
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyView from "./components/DailyView.tsx";

export default function AnalyticsScreen() {
    const [selectedTab, setSelectedTab] = useState<'day' | 'week' | 'month' | 'year'>('day');

    const renderLayout = () => {
        switch (selectedTab) {
            case 'day':
                return <DailyView />;
            case 'week':
            case 'month':
                return (
                    <>
                        <ComfortChart tab={selectedTab} />
                        <ComfortSummaryCard type="tempHumidityDistribution" />
                        <ComfortSummaryCard type="activityDistribution" />
                        <ComfortSummaryCard type="weeklyComparison" />
                        <ComfortSummaryCard type="topLocation" />
                    </>
                );
            case 'year':
                return (
                    <>
                        <ComfortSummaryCard type="bestMonth" />
                        <ComfortSummaryCard type="mostFeedbackMonth" />
                        <ComfortSummaryCard type="topLocation" />
                        <ComfortChart tab="heatmap" />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* ✅ 插入 SegmentedButtons 作为正文上方过滤器 */}
                <AnalysisTabBar selectedTab={selectedTab} onSelectTab={setSelectedTab} />

                {renderLayout()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    safeArea: {
        flex: 12,
        backgroundColor: '#fff',
    },
});
