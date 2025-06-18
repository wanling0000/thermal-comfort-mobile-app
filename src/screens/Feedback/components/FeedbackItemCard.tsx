import React from 'react';
import { View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { FeedbackInput } from '../../../types/Feedback';

const emojiMap = {
    '-2': '🥶',
    '-1': '😰',
    '0': '😊',
    '1': '🌤️',
    '2': '🥵',
};

export default function FeedbackItemCard({
                                             item,
                                             onEdit,
                                             onDelete,
                                         }: {
    item: FeedbackInput;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isDetailed = item.feedback_type === 'detailed';
    const summary = isDetailed
        ? `${item.notes ?? 'No notes'}`
        : emojiMap[item.comfort_level?.toString() as keyof typeof emojiMap] ?? '📝';


    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
                <Text variant="titleSmall">{summary}</Text>
                <Text variant="bodySmall">{item.location_display_name}</Text>
            </View>
            <IconButton icon="pencil" onPress={onEdit} />
            <IconButton icon="delete" onPress={onDelete} />
        </View>
    );
}
