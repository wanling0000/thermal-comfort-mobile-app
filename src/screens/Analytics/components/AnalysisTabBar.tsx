import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const tabs = ['day', 'week', 'month', 'year'];

export default function AnalysisTabBar({
                                           selectedTab,
                                           onSelectTab,
                                       }: {
    selectedTab: string;
    onSelectTab: (tab: string) => void;
}) {
    return (
        <View style={styles.container}>
            {tabs.map(tab => (
                <Button
                    key={tab}
                    mode={tab === selectedTab ? 'contained' : 'outlined'}
                    onPress={() => onSelectTab(tab)}
                    style={styles.button}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
});
