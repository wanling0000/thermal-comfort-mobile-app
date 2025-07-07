// 用于分析页面的类型定义

import {ApiResponse} from "./api.ts";

export type FeedbackSnapshot = {
    feedbackId: string;
    comfortLevel: number;
    notes?: string | null;
    activityTypeId?: string | null;
    clothingLevel?: string | null;
    readingId: string;
};

export type DailyChartPoint = {
    timestamp: number;
    temperature: number;
    humidity: number;
    feedback: FeedbackInfoDTO | null;
};

export interface FeedbackInfoDTO {
    feedbackId: string;
    comfortLevel: number;
    notes?: string;
    activityTypeId?: string;
    clothingLevel?: string;
}


export type ChartTab = 'day' | 'week' | 'month' | 'year' | 'heatmap';

export type ComfortChartProps = {
    tab: ChartTab;
    data: DailyChartPoint[];
};

export type InsightType = 'COMFORT_LEVEL' | 'ACTIVITY' | 'LOCATION';

export type InsightCardEntity = {
    title: string;
    content: string;
    type: InsightType;
};

export type SummaryInsightResponseDTO = {
    resolution: 'DAILY' | 'WEEK' | 'MONTH' | 'YEAR';
    startDate: string; // ISO date string
    endDate: string;
    insights: InsightCardEntity[];
    locationInsights: any[]; // 可细化
};

export type SummaryInsightApiResponse = ApiResponse<SummaryInsightResponseDTO>;

export type Resolution = 'DAILY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface ComfortStatisticsDTO {
    total: number;
    levelCounts: Record<string, number>; // 支持后端返回 "-2", "-1", ..., "2"
}

// 每日舒适度统计（用于年视图）
export type DailyComfortStatDTO = {
    date: string; // ISO 格式，例如 "2025-07-05"
    averageComfort: number | null; // 可为 null，表示无数据
    feedbackCount: number;
};

// 年度统计数据
export type YearlyComfortStatsDTO = {
    year: number;
    data: DailyComfortStatDTO[];
};
