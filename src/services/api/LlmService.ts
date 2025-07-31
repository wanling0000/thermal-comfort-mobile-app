import {ApiResponse} from "../../types/api.ts";
import {request} from "../../utils/request.ts";
import {
    ActivityDistributionDTO,
    ClothingDistributionDTO,
    ComfortLevelEnvironmentRangeDTO,
    MonthlyLLMInsightDTO,
    TopLocationDTO,
    TrendComparisonDTO
} from "../../types/llmInsight.ts";

export const LlmService = {
    getMonthlyInsight: async (date: Date): Promise<MonthlyLLMInsightDTO> => {
        const res = await request<ApiResponse<any>>(
            `/api/v1/ai/insight/month?date=${date.toISOString().split('T')[0]}`,
            { method: "GET" }
        );

        const raw = res.data;

        // 映射
        const mapped: MonthlyLLMInsightDTO = {
            startDate: raw.start_date,
            endDate: raw.end_date,
            totalFeedbackCount: raw.total_feedback_count,
            comfortLevelCounts: raw.comfort_level_counts,
            comfortLevelPercentages: raw.comfort_level_percentages,

            activityDistribution: raw.activity_distribution.map((item: any): ActivityDistributionDTO => ({
                activityTypeId: item.activity_type_id,
                count: item.count,
                percentage: item.percentage,
            })),

            clothingDistribution: raw.clothing_distribution.map((item: any): ClothingDistributionDTO => ({
                clothingLevel: item.clothing_level,
                count: item.count,
                percentage: item.percentage,
            })),

            comfortLevelEnvRanges: raw.comfort_level_env_ranges.map((item: any): ComfortLevelEnvironmentRangeDTO => ({
                comfortLevel: item.comfort_level,
                minTemp: item.min_temp,
                maxTemp: item.max_temp,
                minHumidity: item.min_humidity,
                maxHumidity: item.max_humidity,
                sampleCount: item.sample_count,
            })),

            trendComparison: {
                currentCount: raw.trend_comparison.current_count,
                currentComfortRatio: raw.trend_comparison.current_comfort_ratio,
                previousCount: raw.trend_comparison.previous_count,
                previousComfortRatio: raw.trend_comparison.previous_comfort_ratio,
                delta: raw.trend_comparison.delta,
            } as TrendComparisonDTO,

            topLocation: raw.top_location
                ? {
                    name: raw.top_location.name,
                    latitude: raw.top_location.latitude,
                    longitude: raw.top_location.longitude,
                    comfortStats: raw.top_location.comfort_stats,
                    totalCount: raw.top_location.total_count,
                } as TopLocationDTO
                : null,
        };

        return mapped;
    },
};
