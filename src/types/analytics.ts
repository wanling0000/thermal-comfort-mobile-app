// 用于分析页面的类型定义

export type FeedbackSnapshot = {
    feedbackId: string;
    comfortLevel: number;
    notes?: string | null;
    activityTypeId?: string | null;
    clothingLevel?: string | null;
    readingId: string;
};

export type DailyChartPoint = {
    timestamp: number;         // 毫秒时间戳
    temperature: number;
    humidity: number;
    feedback?: FeedbackSnapshot | null;
};

export type ChartTab = 'day' | 'week' | 'month' | 'year' | 'heatmap';

export type ComfortChartProps = {
    tab: ChartTab;
    data: DailyChartPoint[];
};

export type InsightType = 'COMFORT_LEVEL' | 'ACTIVITY' | 'LOCATION';

export type InsightCardEntity = {
    title: string;
    value: string;
    type: InsightType;
};

export type SummaryInsightResponseDTO = {
    resolution: 'DAILY' | 'WEEK' | 'MONTH' | 'YEAR';
    startDate: string; // ISO date string
    endDate: string;
    insights: InsightCardEntity[];
    locationInsights: any[]; // 可细化
};

export type Resolution = 'DAILY' | 'WEEK' | 'MONTH' | 'YEAR';
