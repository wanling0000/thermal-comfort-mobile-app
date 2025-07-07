import {useEffect, useState} from "react";
import {DailyChartPoint, InsightCardEntity} from "../../../types/analytics.ts";
import {AnalyticsService} from "../../../services/api/AnalyticsService.ts";
import {ActivityIndicator, Text} from "react-native-paper";
import ComfortChart from "./ComfortChart.tsx";
import ComfortSummaryCard from "./ComfortSummaryCard.tsx";
import {View} from "react-native";



export default function DailyView() {
    const [data, setData] = useState<DailyChartPoint[] | null>(null);
    const [summary, setSummary] = useState<InsightCardEntity[] | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = "admin";
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [chartData, summaryRes] = await Promise.all([
                    AnalyticsService.getDailyChartData(userId, today),
                    AnalyticsService.getSummary(userId, today, "DAILY"),
                ]);
                // console.log("chartData:", chartData);
                // console.log("summaryRes:", summaryRes);

                setData(chartData);
                setSummary(summaryRes?.data?.insights ?? []);
            } catch (error) {
                console.error("Failed to fetch daily analytics:", error);
                setData(null);
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [today]);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 48 }} />;
    }

    if (!data || !summary) {
        return (
            <View style={{ marginTop: 48, alignItems: "center" }}>
                <Text style={{ color: "gray" }}>
                    Failed to load daily analytics. Please try again later.
                </Text>
            </View>
        );
    }

    return (
        <>
            <ComfortChart tab="day" data={data} />

            {summary.map((item, index) => (
                <ComfortSummaryCard key={index} insight={item} />
            ))}
        </>
    );
}
