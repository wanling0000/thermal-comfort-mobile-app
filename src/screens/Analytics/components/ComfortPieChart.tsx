import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { ComfortStatisticsDTO } from "../../../types/analytics.ts";

const comfortLevels = [
    { value: -2, label: 'Too Cold', emoji: '🥶', color: '#c9e0e5', gradient: '#b5d4db' },
    { value: -1, label: 'Cold',     emoji: '🧊', color: '#bed2c6', gradient: '#a5c0b3' },
    { value:  0, label: 'Comfort',  emoji: '😊', color: '#ffd19d', gradient: '#ffc278' },
    { value:  1, label: 'Warm',     emoji: '🌤️', color: '#feb29f', gradient: '#fd9f8b' },
    { value:  2, label: 'Too Hot',  emoji: '🥵', color: '#ed8687', gradient: '#e86d6f' },
];

type Props = {
    stats: ComfortStatisticsDTO;
};

type PieSection = {
    value: number;
    color: string;
    gradientCenterColor: string;
    label: string;
    emoji: string;
    focused?: boolean;
};

export default function ComfortPieChart({ stats }: Props) {
    if (!stats || stats.total === 0 || typeof stats.levelCounts !== 'object') return null;

    // 👉 状态管理：当前 focus 的扇区 index
    const [focusedIndex, setFocusedIndex] = useState(0);

    const pieData: PieSection[] = comfortLevels
        .map(({ value, label, emoji, color, gradient }) => {
            const count = stats.levelCounts?.[value.toString()] ?? 0;
            if (count === 0) return null;
            return {
                value: count,
                color,
                gradientCenterColor: gradient,
                label,
                emoji,
            };
        })
        .filter(Boolean) as PieSection[];

    // 更新 focused 状态
    const pieDataWithFocus = pieData.map((d, i) => ({
        ...d,
        focused: i === focusedIndex,
    }));

    const focused = pieDataWithFocus[focusedIndex];
    const focusedPercentage = Math.round((focused.value / stats.total) * 100);

    const renderDot = (color: string) => (
        <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color, marginRight: 8 }} />
    );

    const renderLegendComponent = () => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {pieData.map((section, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', width: 160, marginVertical: 4, marginRight: 12 }}>
                    {renderDot(section.color)}
                    <Text style={{ color: '#555', fontSize: 14 }}>
                        {section.emoji} {section.label}: {Math.round((section.value / stats.total) * 100)}%
                    </Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={{
            margin: 20,
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#ffffff',
            shadowColor: '#ccc',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
        }}>
            <Text style={{ color: '#333', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                Comfort Distribution
            </Text>

            <View style={{ padding: 20, alignItems: 'center' }}>
                <PieChart
                    data={pieDataWithFocus}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={'#ffffff'}
                    focusOnPress
                    extraRadiusForFocused={10}
                    onPress={(item, index) => setFocusedIndex(index)} // 👉 点击更新
                    centerLabelComponent={() => (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, color: '#333', fontWeight: 'bold' }}>
                                {focusedPercentage}%
                            </Text>
                            <Text style={{ fontSize: 14, color: '#333' }}>
                                {focused?.emoji} {focused?.label}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {renderLegendComponent()}
        </View>
    );
}
