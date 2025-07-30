import React, { useState } from 'react';
import { ScrollView, StyleSheet} from 'react-native';
import AnalysisTabBar from './components/AnalysisTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyView from "./components/DailyView.tsx";
import AggregateView from "./components/AggregateView.tsx";
import YearView from "./components/YearView.tsx";

export default function AnalyticsScreen() {
    const [selectedTab, setSelectedTab] = useState<'day' | 'week' | 'month' | 'year'>('day');

    const renderLayout = () => {
        switch (selectedTab) {
            case 'day':
                return <DailyView />;
            case 'week':
                return <AggregateView type="week" />;
            case 'month':
                return <AggregateView type="month" />;
            case 'year':
                return <YearView />;
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
        flex: 1,
        backgroundColor: '#fff',
    },
});
