import {MonthlyLLMInsightDTO} from "../../types/llmInsight.ts";

export function generatePrompt(insight: MonthlyLLMInsightDTO): string {
    const comfortLines = insight.comfortLevelEnvRanges
        .filter(e => e.sampleCount > 0)
        .map(e => {
            const levelLabel = {
                "-2": "Too Cold",
                "-1": "Cold",
                "0": "Comfortable",
                "1": "Warm",
                "2": "Too Hot"
            }[e.comfortLevel.toString()] || e.comfortLevel;

            return `- ${levelLabel}: ${e.minTemp}–${e.maxTemp}°C, ${e.minHumidity}–${e.maxHumidity}% humidity, ${e.sampleCount} samples`;
        })
        .join('\n');

    const activityStr = insight.activityDistribution.length > 0
        ? insight.activityDistribution.map(a =>
            `${a.activityTypeId} (${a.percentage.toFixed(1)}%)`
        ).join(', ')
        : 'N/A';

    const clothingStr = insight.clothingDistribution.length > 0
        ? insight.clothingDistribution.map(c =>
            `${c.clothingLevel} (${c.percentage.toFixed(1)}%)`
        ).join(', ')
        : 'N/A';

    const trend = insight.trendComparison;
    const trendLine = `Comfortable ratio this month: ${trend.currentComfortRatio.toFixed(1)}%, last month: ${trend.previousComfortRatio.toFixed(1)}%`;

    return `
You are an AI assistant helping users analyze their thermal comfort patterns.

Based on the structured feedback data below, please generate a short English suggestion (within 150 words), written in a friendly and helpful tone, to help the user improve their comfort in daily life.

=== Comfort Levels & Temperature-Humidity Ranges ===
${comfortLines}

=== Activity Distribution ===
${activityStr}

=== Clothing Distribution ===
${clothingStr}

=== Comfort Trend ===
${trendLine}

Please generate a one-paragraph English summary with practical and gentle advice for the user. Be concise, informative, and human-like.
`;
}
