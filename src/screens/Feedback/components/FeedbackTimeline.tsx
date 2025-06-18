import React from 'react';
import Timeline from 'react-native-beautiful-timeline';
import { FeedbackInput } from '../../../types/Feedback';
import FeedbackItemCard from './FeedbackItemCard';


const emojiOptions = [
    { value: -2, emoji: '🥶', label: 'Too Cold' },
    { value: -1, emoji: '🧊', label: 'Cold' },
    { value: 0, emoji: '😊', label: 'Comfortable' },
    { value: 1, emoji: '🌤️', label: 'Warm' },
    { value: 2, emoji: '🥵', label: 'Too Hot' },
];

const emojiMap = Object.fromEntries(
    emojiOptions.map(opt => [opt.value, `${opt.emoji} ${opt.label}`])
);


export default function FeedbackTimeline({
                                             feedbackList,
                                             onRefresh,
                                         }: {
    feedbackList: FeedbackInput[];
    onRefresh: () => void;
}) {
    const groupedByDay: { [key: string]: FeedbackInput[] } = {};

    feedbackList.forEach(item => {
        const dayKey = new Date(item.timestamp).toDateString(); // 简单按天分组
        if (!groupedByDay[dayKey]) {
            groupedByDay[dayKey] = [];
        }
        groupedByDay[dayKey].push(item);
    });

    const timelineData = Object.entries(groupedByDay).map(([dayStr, entries]) => {
        const dayTimestamp = new Date(dayStr).getTime();

        return {
            date: dayTimestamp,
            data: entries.map(entry => ({
                title:
                    entry.feedback_type === 'detailed'
                        ? entry.notes ?? 'No notes'
                        : emojiMap[entry.comfort_level?.toString() as keyof typeof emojiMap] ?? '📝',
                subtitle: entry.location_display_name ?? '',
                date: entry.timestamp,
            })),
        };
    });

    return <Timeline data={timelineData} />;
}
