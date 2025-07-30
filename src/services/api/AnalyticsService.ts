import {
    ComfortStatisticsDTO,
    DailyChartPoint,
    DailyComfortStatDTO,
    Resolution,
    SummaryInsightResponseDTO, YearlyComfortStatsDTO
} from "../../types/analytics.ts";
import {request} from "../../utils/request.ts";
import {ApiResponse} from "../../types/api.ts";

export const AnalyticsService = {
    getDailyChartData: async (date: string): Promise<DailyChartPoint[]> => {
        const res = await request<ApiResponse<DailyChartPoint[]>>(
            `/api/analytics/daily?date=${date}`,
            { method: 'GET' }
        );
        return res.data;
    },

    getComfortStats: async (date: string, type: 'week' | 'month'): Promise<ComfortStatisticsDTO> => {
        const res = await request<ApiResponse<any>>(
            `/api/analytics/${type}?date=${date}`,
            { method: 'GET' }
        );
        const raw = res.data;

        // console.log("✅ Service Raw Data:", raw);

        const mapped: ComfortStatisticsDTO = {
            total: raw.total,
            levelCounts: raw.level_counts,  // 👈 你这里必须手动映射成 camelCase！
        };

        // console.log("✅ Mapped Data:", mapped);

        return mapped;
    },

    getYearlyStats: async (
        year: number
    ): Promise<DailyComfortStatDTO[]> => {
        const res = await request<ApiResponse<YearlyComfortStatsDTO>>(
            `/api/analytics/yearly?year=${year}`,
            { method: 'GET' }
        );

        const raw = res.data.data;

        const mapped: DailyComfortStatDTO[] = raw.map((item: any) => ({
            date: item.date,
            averageComfort:
                typeof item.average_comfort === 'number' ? item.average_comfort : null,
            feedbackCount: item.feedback_count ?? 0,
        }));

        return mapped;
    },


    getSummary: async (
        date: string,
        resolution: Resolution
    ): Promise<ApiResponse<SummaryInsightResponseDTO>> => {
        const url = `/api/analytics/summary?date=${date}&resolution=${resolution}`;
        return request(url, { method: 'GET' });
    },
};
