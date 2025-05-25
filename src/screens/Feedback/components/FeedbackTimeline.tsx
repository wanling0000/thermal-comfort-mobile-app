import React from 'react';
import { Timeline } from '@zfkcyjy/react-native-beautiful-timeline';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

const emojiMap = {
    '-2': '🥶',
    '-1': '😰',
    '0': '😊',
    '1': '🌤️',
    '2': '🥵',
};

export default function FeedbackTimeline({ feedbackList, onRefresh }) {
    const data = feedbackList.map((item) => ({
        title: new Date(item.timestamp).toLocaleTimeString(),
        description: `${item.notes ?? emojiMap[item.comfort_level?.toString()] ?? '📝'} 📍 ${item.locationDisplayName ?? ''}`,
        lineColor: item.feedback_type === 'quick' ? '#6c5ce7' : '#00b894',
        rightRender: (
            <View style={{ flexDirection: 'row' }}>
                <IconButton icon="pencil" onPress={() => console.log('edit')} />
                <IconButton icon="delete" onPress={() => console.log('delete')} />
            </View>
        ),
    }));

    return <Timeline data={data} />;
}
