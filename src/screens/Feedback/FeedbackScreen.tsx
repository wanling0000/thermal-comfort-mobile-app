import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from "react-native-paper";
import { FeedbackService } from "../../services/api/FeedbackService.ts";
import FeedbackTimeline from "./components/FeedbackTimeline.tsx";
import FeedbackFormModal from "./components/FeedbackFormModal.tsx";
import { FeedbackInput } from '../../types/Feedback.ts';
import {useLocation} from "../../services/location/useLocation.ts";
import {assembleEnvironmentalReading} from "../../services/assemble/assembleEnvironmentalReading.ts";
import {usePrimarySensorSummary} from "../../hooks/usePrimarySensorSummary.ts";

type FeedbackEntry = FeedbackInput;

export default function FeedbackScreen() {
    console.log('[🧩 FeedbackScreen loaded]');

    const [modalVisible, setModalVisible] = useState(false);
    const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
    const { primarySensor } = usePrimarySensorSummary();
    const { location } = useLocation();

    const reading = primarySensor && location
        ? assembleEnvironmentalReading(primarySensor, location)
        : null;

    const fetchFeedback = async () => {
        try {
            const data = await FeedbackService.getAllFeedback() as FeedbackInput[];
            console.log('[🟢 Feedback List]', data);
            const sorted = data.sort((a: FeedbackEntry, b: FeedbackEntry) => b.timestamp - a.timestamp);
            setFeedbackList(sorted);
        } catch (error) {
            console.error('[🔥 fetchFeedback error]', error);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                icon="plus"
                onPress={() => setModalVisible(true)}
                style={styles.addButton}
            >
                Add Feedback
            </Button>

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
    addButton: { marginBottom: 12 },
    timelineWrapper: { flex: 1 },
});
