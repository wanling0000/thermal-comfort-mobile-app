import React from 'react';
import {FeedbackInput, FeedbackResponse} from '../../../types/Feedback';
import Timeline from "../../../components/ui/CustomTimeline/Timeline.tsx";
import { format, toZonedTime } from 'date-fns-tz';

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
                                             onSelectFeedback,
                                         }: {
    feedbackList: FeedbackResponse[];
    onRefresh: () => void;
    onSelectFeedback: (feedback: FeedbackResponse) => void;
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
                title: emojiMap[entry.comfort_level] ?? '📝',
                subtitle: entry.location_display_name ?? '',
                date: entry.timestamp,
                displayDate: format(new Date(entry.timestamp), 'yyyy-MM-dd HH:mm'),
                onPress: () => onSelectFeedback(entry),
            }))
        };
    });

    return <Timeline data={timelineData} />;
}
