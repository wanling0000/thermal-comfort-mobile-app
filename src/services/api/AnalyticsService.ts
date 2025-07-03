import {DailyChartPoint, Resolution, SummaryInsightResponseDTO} from "../../types/analytics.ts";
import {request} from "../../utils/request.ts";

export const AnalyticsService = {
    getDailyChartData: async (userId: string, date: string): Promise<DailyChartPoint[]> => {
        return request(`/api/analytics/daily?userId=${userId}&date=${date}`, {
            method: 'GET',
        });
    },

    getSummary: async (
        userId: string,         // 如 "dev-user"
        date: string,           // 如 "2025-07-03"
        resolution: Resolution  // 如 "DAILY"
    ): Promise<SummaryInsightResponseDTO> => {
        const url = `/api/analytics/summary?userId=${userId}&date=${date}&resolution=${resolution}`;
        return request(url, { method: 'GET' });
    },
};
