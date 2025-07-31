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
        const formattedDate = date.toISOString().split('T')[0];
        const url = `/api/v1/ai/insight/month?date=${formattedDate}`;

        // console.log("[🌐 LLM Request URL]", url);

        const res = await request<ApiResponse<any>>(url, { method: "GET" });

        const raw = res.data;
        //
        // console.log("[📦 LLM Raw Response]", JSON.stringify(raw, null, 2));

        // 映射
        const mapped: MonthlyLLMInsightDTO = {
            startDate: raw.startDate,
            endDate: raw.endDate,
            totalFeedbackCount: raw.totalFeedbackCount,
            comfortLevelCounts: raw.comfortLevelCounts,
            comfortLevelPercentages: raw.comfortLevelPercentages,

            activityDistribution: Array.isArray(raw.activityDistribution)
                ? raw.activityDistribution.map((item: any): ActivityDistributionDTO => ({
                    activityTypeId: item.activityTypeId,
                    count: item.count,
                    percentage: item.percentage,
                }))
                : [],

            clothingDistribution: Array.isArray(raw.clothingDistribution)
                ? raw.clothingDistribution.map((item: any): ClothingDistributionDTO => ({
                    clothingLevel: item.clothingLevel,
                    count: item.count,
                    percentage: item.percentage,
                }))
                : [],

            comfortLevelEnvRanges: Array.isArray(raw.comfortLevelEnvRanges)
                ? raw.comfortLevelEnvRanges.map((item: any): ComfortLevelEnvironmentRangeDTO => ({
                    comfortLevel: item.comfortLevel,
                    minTemp: item.minTemp,
                    maxTemp: item.maxTemp,
                    minHumidity: item.minHumidity,
                    maxHumidity: item.maxHumidity,
                    sampleCount: item.sampleCount,
                }))
                : [],

            trendComparison: raw.trendComparison
                ? {
                    currentCount: raw.trendComparison.currentCount,
                    currentComfortRatio: raw.trendComparison.currentComfortRatio,
                    previousCount: raw.trendComparison.previousCount,
                    previousComfortRatio: raw.trendComparison.previousComfortRatio,
                    delta: raw.trendComparison.delta,
                }
                : {
                    currentCount: 0,
                    currentComfortRatio: 0,
                    previousCount: 0,
                    previousComfortRatio: 0,
                    delta: 0,
                },

            topLocation: raw.topLocation
                ? {
                    name: raw.topLocation.name,
                    latitude: raw.topLocation.latitude,
                    longitude: raw.topLocation.longitude,
                    comfortStats: raw.topLocation.comfortStats,
                    totalCount: raw.topLocation.totalCount,
                }
                : null,
        };
        //
        // console.log("[✅ Mapped Monthly Insight]", JSON.stringify(mapped, null, 2));

        return mapped;
    },
};
