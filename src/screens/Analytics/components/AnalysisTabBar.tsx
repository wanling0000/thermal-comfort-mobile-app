import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

type TabOption = 'day' | 'week' | 'month' | 'year';

export default function AnalysisTabBar({
                                           selectedTab,
                                           onSelectTab,
                                       }: {
    selectedTab: TabOption;
    onSelectTab: (tab: TabOption) => void;
}) {
    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={selectedTab}
                onValueChange={(value: TabOption) => onSelectTab(value)}
                buttons={[
                    { value: 'day', label: 'Daily' },
                    { value: 'week', label: 'Weekly' },
                    { value: 'month', label: 'Monthly' },
                    { value: 'year', label: 'Yearly' },
                ]}
                style={styles.segmented}
                theme={{
                    // 让 label 字号更小
                    fonts: {
                        labelLarge: {
                            fontSize: 10, // ✅ 字号压缩
                        },
                    },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    segmented: {
        alignSelf: 'center', // 居中显示
        maxWidth: '95%',       // ✅ 限宽防止撑满
    },
});
