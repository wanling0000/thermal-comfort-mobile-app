export type ComfortLevelEnvironmentRangeDTO = {
    comfortLevel: number; // -2 ~ 2
    minTemp: number;
    maxTemp: number;
    minHumidity: number;
    maxHumidity: number;
    sampleCount: number;
};

export type ActivityDistributionDTO = {
    activityTypeId: string;
    count: number;
    percentage: number;
};

export type ClothingDistributionDTO = {
    clothingLevel: string;
    count: number;
    percentage: number;
};

export type TrendComparisonDTO = {
    currentCount: number;
    currentComfortRatio: number;
    previousCount: number;
    previousComfortRatio: number;
    delta: number;
};

export type TopLocationDTO = {
    name: string;
    latitude: number;
    longitude: number;
    comfortStats: Record<number, number>; // -2 ~ 2 => count
    totalCount: number;
};

export type MonthlyLLMInsightDTO = {
    startDate: string;
    endDate: string;
    totalFeedbackCount: number;

    comfortLevelCounts: Record<number, number>;
    comfortLevelPercentages: Record<number, number>;

    activityDistribution: ActivityDistributionDTO[];
    clothingDistribution: ClothingDistributionDTO[];
    comfortLevelEnvRanges: ComfortLevelEnvironmentRangeDTO[];

    trendComparison: TrendComparisonDTO;
    topLocation: TopLocationDTO | null;
};
