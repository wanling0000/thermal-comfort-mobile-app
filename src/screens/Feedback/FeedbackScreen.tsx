import React, {useCallback, useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import {Button, FAB} from "react-native-paper";
import { FeedbackService } from "../../services/api/FeedbackService.ts";
import { FeedbackResponse} from '../../types/Feedback.ts';
import {useLocation} from "../../services/location/useLocation.ts";
import {assembleEnvironmentalReading} from "../../services/assemble/assembleEnvironmentalReading.ts";
import {usePrimarySensorSummary} from "../../hooks/usePrimarySensorSummary.ts";
import MonthPicker from "react-native-month-year-picker";
import {useFeedbackRefresh} from "../../context/FeedbackRefreshContext.tsx";
import LLMChatModal from "./components/LLMChatModal.tsx";
import UpdateFeedbackFormModal from "./components/UpdateFeedbackFormModal.tsx";
import FeedbackTimeline from "./components/FeedbackTimeline.tsx";
import FeedbackFormModal from "./components/FeedbackFormModal.tsx";


export default function FeedbackScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [feedbackList, setFeedbackList] = useState<FeedbackResponse[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [chatVisible, setChatVisible] = useState(false);

    const { primarySensor } = usePrimarySensorSummary();
    const { location } = useLocation();

    const { lastRefreshTime } = useFeedbackRefresh();
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);

    const reading = primarySensor && location
        ? assembleEnvironmentalReading(primarySensor, location)
        : null;

    const fetchFeedback = useCallback(async () => {
        try {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const list = await FeedbackService.getFeedbackByMonth(year, month);

            const sorted = list.sort(
                (a, b) => (b as any).timestamp - (a as any).timestamp
            );
            setFeedbackList(sorted);

        } catch (error) {
            console.error('[🔥 fetchFeedback error]', error);
        }
    }, [selectedDate]);


    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback, lastRefreshTime]);

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
                onSelectFeedback={(feedback: FeedbackResponse) => {
                    setSelectedFeedback(feedback);
                }}
            />

            <FeedbackFormModal
                visible={modalVisible}
                reading={reading}
                onDismiss={() => {
                    setModalVisible(false);
                }}
                onSubmit={async (payload) => {
                    await FeedbackService.submitFeedbackWithReading(payload);
                    await fetchFeedback();
                    setModalVisible(false);
                }}
            />

            <UpdateFeedbackFormModal
                visible={selectedFeedback !== null}
                feedback={selectedFeedback}
                onDismiss={() => setSelectedFeedback(null)}
                onUpdate={async (updated) => {
                    console.log("[✏️ Update Feedback Payload]", JSON.stringify(updated, null, 2));

                    await FeedbackService.updateFeedback(updated);
                    await fetchFeedback();
                    setSelectedFeedback(null);
                }}
                onDelete={async (id) => {
                    await FeedbackService.deleteFeedback(id);
                    await fetchFeedback();
                    setSelectedFeedback(null);
                }}
            />

            <FAB
                icon="robot"
                label="AI Insight"
                style={styles.fab}
                onPress={() => setChatVisible(true)}
            />

            <LLMChatModal
                visible={chatVisible}
                date={selectedDate}
                onDismiss={() => setChatVisible(false)}
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
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 24,
    },
});


