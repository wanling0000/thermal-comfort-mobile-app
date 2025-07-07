import React from 'react';
import { View, Dimensions, ScrollView, Text } from 'react-native';
import { LineChart, CurveType } from 'react-native-gifted-charts';
import { DailyChartPoint } from '../../../types/analytics';

const TEMP_COLOR = 'red';
const HUMIDITY_COLOR = 'blue';

const emojiOptions = [
    { value: -2, emoji: '🥶', label: 'Too Cold' },
    { value: -1, emoji: '🧊', label: 'Cold' },
    { value: 0, emoji: '😊', label: 'Comfortable' },
    { value: 1, emoji: '🌤️', label: 'Warm' },
    { value: 2, emoji: '🥵', label: 'Too Hot' },
];

export default function DayChart({ data }: { data: DailyChartPoint[] }) {
    if (!data || data.length === 0) return null;

    console.log('DayChart: ', data);

    const screenWidth = Dimensions.get('window').width;
    const chartHeight = 240;

    /**
     * Step 1: 去重 timestamp
     * 优先保留含 feedback 的读数；否则保留任意一个。
     */
    const deduplicatedDataMap = new Map<number, DailyChartPoint>();
    for (const reading of data) {
        const existing = deduplicatedDataMap.get(reading.timestamp);
        if (!existing) {
            deduplicatedDataMap.set(reading.timestamp, reading);
        } else if (!existing.feedback && reading.feedback) {
            deduplicatedDataMap.set(reading.timestamp, reading);
        }
    }
    const deduplicatedData = Array.from(deduplicatedDataMap.values());

    const spacing = 24;
    const contentWidth = spacing * deduplicatedData.length;

    /**
     * Step 2: 构造温度数据（带 emoji 和横坐标 label）
     */
    const temperatureData = deduplicatedData.map((reading, index) => {
        const date = new Date(reading.timestamp);
        const hourLabel = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
            hour12: false,
        });

        const emoji =
            reading.feedback?.comfort_level != null
                ? emojiOptions.find((e) => e.value === reading.feedback.comfort_level)?.emoji
                : null;

        return {
            value: reading.temperature,
            label: index % 6 === 0 ? hourLabel : '',
            showXAxisIndex: index % 6 === 0,
            dataPointLabelComponent: emoji
                ? () => <Text style={{ fontSize: 16 }}>{emoji}</Text>
                : undefined,
        };
    });

    const humidityData = deduplicatedData.map((reading) => ({
        value: reading.humidity,
    }));

    const readingAtIndex = (index: number): DailyChartPoint | undefined => {
        return deduplicatedData[index];
    };

    /**
     * Tooltip 配置
     */
    const pointerConfig = {
        radius: 4,
        pointer1Color: TEMP_COLOR,
        pointer2Color: HUMIDITY_COLOR,
        showPointerStrip: true,
        pointerStripColor: '#aaa',
        stripOverPointer: true,
        pointerLabelComponent: (items: any[], secondaryItem: any, index: number) => {
            const reading = readingAtIndex(index);
            if (!reading) return null;

            const time = new Date(reading.timestamp).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC',
            });

            const emoji =
                reading.feedback?.comfort_level != null
                    ? emojiOptions.find((e) => e.value === reading.feedback.comfort_level)?.emoji
                    : null;

            return (
                <View
                    style={{
                        backgroundColor: '#fff',
                        padding: 6,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#ccc',
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{time} UTC</Text>
                    <Text style={{ fontSize: 12 }}>🌡 {reading.temperature}°C</Text>
                    <Text style={{ fontSize: 12 }}>💧 {reading.humidity}%</Text>
                    {emoji && (
                        <View style={{ marginTop: 6 }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Comfort:</Text>
                            <Text style={{ fontSize: 16 }}>
                                {emoji}{' '}
                                {emojiOptions.find((e) => e.emoji === emoji)?.label ?? ''}
                            </Text>
                        </View>
                    )}
                </View>
            );
        },
        pointerLabelWidth: 80,
        pointerLabelHeight: 80,
        autoAdjustPointerLabelPosition: true,
        persistPointer: true,
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                paddingHorizontal: 8,
                marginTop: 24,
                width: screenWidth,
                height: chartHeight + 50,
            }}
        >
            {/* 左侧 Y 轴（温度） */}
            <View
                style={{
                    width: 40,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingTop: 4,
                    paddingBottom: 12,
                }}
            >
                {[...Array(9)].map((_, i) => (
                    <Text key={i} style={{ fontSize: 10, color: TEMP_COLOR }}>
                        {40 - i * 5}°C
                    </Text>
                ))}
            </View>

            {/* 中间图表 */}
            <ScrollView
                horizontal
                contentContainerStyle={{
                    paddingBottom: 20,
                    paddingRight: 16,
                }}
                showsHorizontalScrollIndicator
            >
                <View style={{ width: contentWidth }}>
                    <LineChart
                        height={chartHeight}
                        width={contentWidth}
                        data={temperatureData}
                        secondaryData={humidityData}
                        curved
                        curveType={CurveType.CUBIC}
                        thickness={2}
                        color={TEMP_COLOR}
                        maxValue={40}
                        stepValue={5}
                        noOfSections={8}
                        hideDataPoints={false}
                        spacing={spacing}
                        initialSpacing={0}
                        xAxisColor="#999"
                        xAxisLabelTextStyle={{
                            width: 50,
                            color: '#333',
                            fontSize: 10,
                            marginTop: 4,
                        }}
                        xAxisIndicesHeight={4}
                        xAxisIndicesWidth={1}
                        secondaryLineConfig={{
                            color: HUMIDITY_COLOR,
                            curved: true,
                            thickness: 2,
                        }}
                        yAxisTextStyle={{ display: 'none' }}
                        yAxisColor="transparent"
                        yAxisThickness={0}
                        yAxisLabelWidth={0}
                        secondaryYAxis={{
                            maxValue: 100,
                            noOfSections: 5,
                            roundToDigits: 0,
                            yAxisColor: 'transparent',
                            showYAxisIndices: false,
                        }}
                        pointerConfig={pointerConfig}
                    />
                </View>
            </ScrollView>

            {/* 右侧 Y 轴（湿度） */}
            <View
                style={{
                    width: 45,
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingTop: 4,
                    paddingBottom: 12,
                    marginRight: 24,
                }}
            >
                {[...Array(6)].map((_, i) => (
                    <Text key={i} style={{ fontSize: 10, color: HUMIDITY_COLOR }}>
                        {100 - i * 20}%
                    </Text>
                ))}
            </View>
        </View>
    );
}
