import {ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {ComfortStatisticsDTO, InsightCardEntity} from "../../../types/analytics.ts";
import ComfortSummaryCard from "./ComfortSummaryCard.tsx";
import ComfortPieChart from "./ComfortPieChart.tsx";
import {AnalyticsService} from "../../../services/api/AnalyticsService.ts";


export default function AggregateView({ type }: { type: 'week' | 'month' }) {
    const [stats, setStats] = useState<ComfortStatisticsDTO | null>(null);

    const [summary, setSummary] = useState<InsightCardEntity[] | null>(null);
    const userId = 'admin';

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        const fetch = async () => {
            try {
                const [statsData, summaryRes] = await Promise.all([
                    AnalyticsService.getComfortStats(today, type),
                    AnalyticsService.getSummary(userId, today, type === 'week' ? 'WEEK' : 'MONTH'),
                ]);
                setStats(statsData);
                setSummary(summaryRes?.data?.insights ?? []);
            } catch (error) {
                console.error(`Failed to fetch ${type} analytics:`, error);
                setStats(null);
                setSummary(null);
            }
        };

        fetch();
    }, [type]);

    if (!stats || !summary) return null;

    return (
        <ScrollView>
            <ComfortPieChart stats={stats} />
            {summary.map((item, index) => (
                <ComfortSummaryCard key={index} insight={item} />
            ))}
        </ScrollView>
    );
}
