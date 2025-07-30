import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { format, addDays } from 'date-fns';

export type DailyComfortStatDTO = {
    date: string;
    averageComfort: number | null;
    feedbackCount: number;
};

type Props = {
    data: DailyComfortStatDTO[];
    year: number;
};

const comfortColors = {
    [-2]: '#c9e0e5',
    [-1]: '#bed2c6',
    [0]: '#ffd19d',
    [1]: '#feb29f',
    [2]: '#ed8687',
    null: '#eeeeee',
};

const comfortEmojis = {
    [-2]: '🥶',
    [-1]: '🧊',
    [0]: '😊',
    [1]: '🌤️',
    [2]: '🥵',
};

const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getDateKey = (date: string) => date.slice(0, 10);

export default function YearlyComfortHeatmap({ data, year }: Props) {
    const scrollRef = useRef<ScrollView>(null);
    const cellSize = 18;
    const gap = 4;
    const numDays = isLeapYear(year) ? 366 : 365;
    const startDate = new Date(`${year}-01-01`);

    const dataMap = new Map<string, DailyComfortStatDTO>(
        data.map((d) => [getDateKey(d.date), d])
    );

    const weeks: { date: Date; stat: DailyComfortStatDTO | null }[][] = [];
    let week: { date: Date; stat: DailyComfortStatDTO | null }[] = [];

    for (let i = 0; i < numDays; i++) {
        const date = addDays(startDate, i);
        const iso = date.toISOString().slice(0, 10);
        const stat = dataMap.get(iso) ?? null;

        if (date.getDay() === 0 && week.length > 0) {
            weeks.push(week);
            week = [];
        }

        week.push({ date, stat });
    }
    if (week.length > 0) weeks.push(week);

    // 月份标签
    const monthLabels: { name: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((w, i) => {
        const date = w[0]?.date;
        const month = date?.getMonth();
        if (month !== undefined && month !== lastMonth) {
            monthLabels.push({ name: format(date, 'MMM'), index: i });
            lastMonth = month;
        }
    });

    // 自动滚动到今天
    useEffect(() => {
        const today = new Date();
        if (today.getFullYear() !== year) return;

        const diffDays = Math.floor(
            (today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        );
        const weekIndex = Math.floor(diffDays / 7);
        const scrollX = weekIndex * (cellSize + gap) - 40;
        scrollRef.current?.scrollTo({ x: scrollX > 0 ? scrollX : 0, animated: true });
    }, [startDate, year]);

    return (
        <View style={{ padding: 8 }}>
            <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* 月份横跨标签 */}
                    <View style={styles.monthLabelRow}>
                        {monthLabels.map((label, idx) => {
                            const start = label.index;
                            const end = monthLabels[idx + 1]?.index ?? weeks.length;
                            const width = (end - start) * (cellSize + gap) - gap;
                            return (
                                <View
                                    key={label.name + '-' + start}
                                    style={{ width, alignItems: 'center', marginRight: gap }}
                                >
                                    <Text style={styles.monthLabelText}>{label.name}</Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* 热力图主体 */}
                    <View style={{ flexDirection: 'row' }}>
                        {weeks.map((week, colIndex) => (
                            <View key={colIndex} style={{ marginRight: gap }}>
                                {Array.from({ length: 7 }).map((_, rowIndex) => {
                                    const cell = week[rowIndex];
                                    const stat = cell?.stat;
                                    const comfort = stat?.averageComfort ?? null;
                                    const count = stat?.feedbackCount ?? 0;

                                    return (
                                        <View
                                            key={rowIndex}
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                backgroundColor:
                                                    comfortColors[comfort as keyof typeof comfortColors],
                                                marginBottom: gap,
                                                borderRadius: 4,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text style={{ fontSize: 9, color: '#333' }}>
                                                {count > 0 ? count : ''}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* 图例固定 */}
            <View style={styles.legendContainer}>
                {[-2, -1, 0, 1, 2].map((val) => (
                    <View key={val} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: comfortColors[val as keyof typeof comfortColors] },
                            ]}
                        />
                        <Text style={styles.legendText}>
                            {comfortEmojis[val as keyof typeof comfortEmojis]}{' '}
                            {val === 0 ? 'Comfort' : val < 0 ? 'Cold' : 'Hot'}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    monthLabelRow: {
        flexDirection: 'row',
        marginBottom: 6,
        marginLeft: 0,
    },
    monthLabelText: {
        fontSize: 10,
        color: '#666',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 6,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 3,
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    legendText: {
        fontSize: 12,
        color: '#444',
    },
});
