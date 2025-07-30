import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { AnalyticsService } from '../../../services/api/AnalyticsService';
import {DailyComfortStatDTO, InsightCardEntity} from "../../../types/analytics.ts";
import YearlyHeatmap from "./YearlyHeatmap.tsx";
import {ScrollView} from "react-native";
import ComfortSummaryCard from "./ComfortSummaryCard.tsx";

export default function YearView() {
    const [data, setData] = useState<DailyComfortStatDTO[]>([]);
    const [summary, setSummary] = useState<InsightCardEntity[] | null>(null);
    const [loading, setLoading] = useState(true);

    const year = new Date().getFullYear();
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [yearData, summaryRes] = await Promise.all([
                    AnalyticsService.getYearlyStats(year),
                    AnalyticsService.getSummary(today, 'YEAR'),
                ]);
                setData(yearData);
                setSummary(summaryRes?.data?.insights ?? []);
            } catch (error) {
                console.error('Failed to fetch yearly analytics:', error);
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [year, today]);

    if (loading) return <ActivityIndicator style={{ marginTop: 48 }} />;

    return (
        <ScrollView style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                Yearly Comfort Feedback Heatmap
            </Text>
            <YearlyHeatmap data={data} year={year} />

            {summary?.map((insight, idx) => (
                <ComfortSummaryCard key={idx} insight={insight} />
            ))}
        </ScrollView>
    );
}
