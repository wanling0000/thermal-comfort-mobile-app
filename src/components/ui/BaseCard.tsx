import React, { ReactNode } from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Card} from "react-native-paper";
interface BaseCardProps {
    children: ReactNode;
    style?: ViewStyle;
}

const BaseCard = ({ children, style }: BaseCardProps) => {
    return (
        <Card style={[styles.card, style]}>
            {/* 自己包裹 padding，完全控制内容布局 */}
            <View style={styles.inner}>
                {children}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        paddingHorizontal: 0, // ❗️移除 Card 默认 padding（关键）
        paddingVertical: 0,
    },
    inner: {
        paddingHorizontal: 0, // ✅ 控制你想要的左右边距
        paddingVertical: 2,
    },
});

export default BaseCard;
