import React, {useCallback, useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import { FeedbackService } from "../../services/api/FeedbackService.ts";
import FeedbackTimeline from "./components/FeedbackTimeline.tsx";
import FeedbackFormModal from "./components/FeedbackFormModal.tsx";
import { FeedbackInput } from '../../types/Feedback.ts';
import {useLocation} from "../../services/location/useLocation.ts";
import {assembleEnvironmentalReading} from "../../services/assemble/assembleEnvironmentalReading.ts";
import {usePrimarySensorSummary} from "../../hooks/usePrimarySensorSummary.ts";
import MonthPicker from "react-native-month-year-picker";

type FeedbackEntry = FeedbackInput;

export default function FeedbackScreen() {

    const userId = 'admin'; // TODO： uid
    // const userId = auth().currentUser?.uid ?? 'admin';

    const [modalVisible, setModalVisible] = useState(false);
    const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const { primarySensor } = usePrimarySensorSummary();
    const { location } = useLocation(userId);

    const reading = primarySensor && location
        ? assembleEnvironmentalReading(primarySensor, location)
        : null;

    const fetchFeedback = useCallback(async () => {
        try {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const list = await FeedbackService.getFeedbackByMonth(year, month);
            const sorted = list.sort((a, b) => b.timestamp - a.timestamp);
            setFeedbackList(sorted);
        } catch (error) {
            console.error('[🔥 fetchFeedback error]', error);
        }
    }, [selectedDate]);


    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    const onValueChange = (event: any, date?: Date) => {
        setShowPicker(false);
        if (date) {
            setSelectedDate(date);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={() => setModalVisible(true)}
                >
                    Add Feedback
                </Button>

                <Button
                    mode="outlined"
                    icon="calendar-month"
                    onPress={() => setShowPicker(true)}
                >
                    {`${selectedDate.getFullYear()} - ${selectedDate.getMonth() + 1}`}
                </Button>
            </View>

            <View style={styles.spacer} />

            {showPicker && (
                <MonthPicker
                    onChange={onValueChange}
                    value={selectedDate}
                    locale="en"
                    mode="short"
                />
            )}

            <FeedbackTimeline
                feedbackList={feedbackList}
                onRefresh={fetchFeedback}
            />

            <FeedbackFormModal
                visible={modalVisible}
                reading={reading}
                onDismiss={() => setModalVisible(false)}
                onSubmit={async (payload) => {
                    await FeedbackService.submitFeedbackWithReading(payload);
                    await fetchFeedback();
                    setModalVisible(false);
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: '#fff' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    spacer: {
        height: 24,
    },
});
