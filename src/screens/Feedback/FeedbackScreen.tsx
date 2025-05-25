import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Button} from "react-native-paper";
import {FeedbackService} from "../../services/api/FeedbackService.ts";
import FeedbackTimeline from "./components/FeedbackTimeline.tsx";
import FeedbackFormModal from "./components/FeedbackFormModal.tsx";

export default function FeedbackScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);

    const fetchFeedback = async () => {
        const data = await FeedbackService.getAllFeedback(); // 包括 quick + detailed
        const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
        setFeedbackList(sorted);
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

            <ScrollView style={styles.timelineWrapper}>
                <FeedbackTimeline
                    feedbackList={feedbackList}
                    onRefresh={fetchFeedback}
                />
            </ScrollView>

            <FeedbackFormModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                onSubmit={async () => {
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
