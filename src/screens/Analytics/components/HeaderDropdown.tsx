// components/HeaderDropdown.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Menu } from 'react-native-paper';

type TabOption = 'day' | 'week' | 'month' | 'year';

export default function HeaderDropdown({
                                           selectedTab = 'day',
                                           onSelectTab = (tab: TabOption) => {},
                                       }: {
    selectedTab?: TabOption;
    onSelectTab?: (tab: TabOption) => void;
}) {
    const [visible, setVisible] = useState(false);

    const options: { key: TabOption; label: string }[] = [
        { key: 'day', label: 'Daily' },
        { key: 'week', label: 'Weekly' },
        { key: 'month', label: 'Monthly' },
        { key: 'year', label: 'Yearly' },
    ];

    const currentLabel = options.find(opt => opt.key === selectedTab)?.label ?? 'Select';

    return (
        <View style={{ marginRight: 8 }}>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <Button
                        mode="text"
                        icon="chevron-down"
                        onPress={() => setVisible(true)}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        compact
                    >
                        {currentLabel}
                    </Button>
                }
            >
                {options.map(opt => (
                    <Menu.Item
                        key={opt.key}
                        onPress={() => {
                            onSelectTab(opt.key);
                            setVisible(false);
                        }}
                        title={opt.label}
                    />
                ))}
            </Menu>
        </View>
    );
}
