import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
    Modal,
    Portal,
    Text,
    Button,
    TextInput,
    Title,
} from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { ACTIVITY_TAGS } from '../constants/activityTags';
import { CLOTHING_TAGS } from '../constants/clothingTags';
import { FeedbackResponse } from '../../../types/Feedback';
import DatePicker from "react-native-date-picker";

type Props = {
    visible: boolean;
    feedback: FeedbackResponse | null;
    onDismiss: () => void;
    onUpdate: (updated: FeedbackResponse) => void;
    onDelete: (id: string) => void;
};

const emojiOptions = [
    { key: '-2', value: '🥶 Too Cold' },
    { key: '-1', value: '🧊 Cold' },
    { key: '0', value: '😊 Comfortable' },
    { key: '1', value: '🌤️ Warm' },
    { key: '2', value: '🥵 Too Hot' },
];

const adjustedTempOptions = [
    { key: '-2', value: 'Much Cooler' },
    { key: '-1', value: 'Slightly Cooler' },
    { key: '0', value: 'No Change' },
    { key: '1', value: 'Slightly Warmer' },
    { key: '2', value: 'Much Warmer' },
];

const adjustedHumidOptions = [
    { key: '-2', value: 'Much Drier' },
    { key: '-1', value: 'Slightly Drier' },
    { key: '0', value: 'No Change' },
    { key: '1', value: 'Slightly More Humid' },
    { key: '2', value: 'Much More Humid' },
];

export default function UpdateFeedbackFormModal({
                                                    visible,
                                                    feedback,
                                                    onDismiss,
                                                    onUpdate,
                                                    onDelete,
                                                }: Props) {
    const [comfortLevel, setComfortLevel] = useState<string>('0');
    const [adjustedTemp, setAdjustedTemp] = useState<string | null>(null);
    const [adjustedHumid, setAdjustedHumid] = useState<string | null>(null);
    const [activity, setActivity] = useState('');
    const [clothingLevel, setClothingLevel] = useState('');
    const [notes, setNotes] = useState('');
    const [customTag, setCustomTag] = useState('');
    const [timestamp, setTimestamp] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [rawCoordinates, setRawCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        if (feedback) {
            console.log('[🧩 Feedback Raw Data]', feedback);
            console.log('[🧩 Feedback Raw Data]', JSON.stringify(feedback, null, 2));
            console.log('Coordinates Type:', typeof feedback.raw_coordinates);
            console.log('Coordinates Value:', feedback.raw_coordinates);
            console.log('Latitude:', feedback.raw_coordinates?.latitude);
            setComfortLevel(feedback.comfort_level?.toString() ?? '0');
            setAdjustedTemp(feedback.adjusted_temp_level?.toString() ?? null);
            setAdjustedHumid(feedback.adjusted_humid_level?.toString() ?? null);
            setActivity(feedback.activity_type_id ?? '');
            setClothingLevel(feedback.clothing_level ?? '');
            setNotes(feedback.notes ?? '');
            setCustomTag(feedback.custom_tag_name ?? '');
            setRawCoordinates(feedback.raw_coordinates);
            setTimestamp(new Date(feedback.timestamp));
        }
    }, [feedback]);

    const handleUpdate = () => {
        if (!feedback) return;

        const updated = {
            feedback_id: feedback.feedback_id,
            comfort_level: parseInt(comfortLevel),
            feedback_type: feedback.feedback_type,
            location_display_name: feedback.location_display_name,
            is_custom_location: feedback.is_custom_location,
            custom_tag_name: customTag || undefined,
            raw_coordinates: rawCoordinates ?? undefined,
            activity_type_id: activity || undefined,
            clothing_level: clothingLevel || undefined,
            adjusted_temp_level: adjustedTemp ? parseInt(adjustedTemp) : undefined,
            adjusted_humid_level: adjustedHumid ? parseInt(adjustedHumid) : undefined,
            notes: notes || undefined,
            timestamp: timestamp.getTime(),
        };

        console.log('[📤 Submitting update payload]', updated);

        onUpdate(updated);
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Title style={styles.title}>Edit Feedback</Title>

                    <Text>Comfort Level:</Text>
                    <SelectList
                        setSelected={setComfortLevel}
                        data={emojiOptions}
                        save="key"
                        search={false}
                        defaultOption={emojiOptions.find(opt => opt.key === comfortLevel)}
                        boxStyles={styles.dropdown}
                    />

                    <Text>Adjusted Temperature:</Text>
                    <SelectList
                        setSelected={setAdjustedTemp}
                        data={adjustedTempOptions}
                        save="key"
                        search={false}
                        defaultOption={adjustedTempOptions.find(opt => opt.key === adjustedTemp)}
                        boxStyles={styles.dropdown}
                    />

                    <Text>Adjusted Humidity:</Text>
                    <SelectList
                        setSelected={setAdjustedHumid}
                        data={adjustedHumidOptions}
                        save="key"
                        search={false}
                        defaultOption={adjustedHumidOptions.find(opt => opt.key === adjustedHumid)}
                        boxStyles={styles.dropdown}
                    />

                    <Text>Activity:</Text>
                    <SelectList
                        setSelected={setActivity}
                        data={ACTIVITY_TAGS.map(tag => ({ key: tag.id, value: tag.label }))}
                        save="key"
                        search={false}
                        defaultOption={ACTIVITY_TAGS.find(tag => tag.id === activity) && {
                            key: activity,
                            value: ACTIVITY_TAGS.find(tag => tag.id === activity)?.label || activity,
                        }}
                        boxStyles={styles.dropdown}
                    />

                    <Text>Clothing Level:</Text>
                    <SelectList
                        setSelected={setClothingLevel}
                        data={CLOTHING_TAGS.map(tag => ({ key: tag.id, value: tag.label }))}
                        save="key"
                        search={false}
                        defaultOption={CLOTHING_TAGS.find(tag => tag.id === clothingLevel) && {
                            key: clothingLevel,
                            value: CLOTHING_TAGS.find(tag => tag.id === clothingLevel)?.label || clothingLevel,
                        }}
                        boxStyles={styles.dropdown}
                    />

                    <Text>Custom Tag Name:</Text>
                    <TextInput
                        value={customTag}
                        onChangeText={setCustomTag}
                        mode="outlined"
                        placeholder="Home / Office..."
                        style={styles.notesInput}
                    />

                    <Text>Location (readonly):</Text>
                    <TextInput
                        value={feedback?.location_display_name}
                        mode="outlined"
                        disabled
                        style={styles.notesInput}
                    />

                    <Text>Timestamp:</Text>
                    <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.notesInput}>
                        {timestamp.toLocaleString()}
                    </Button>

                    <DatePicker
                        modal
                        open={showDatePicker}
                        date={timestamp}
                        mode="datetime"
                        onConfirm={(date) => {
                            setShowDatePicker(false);
                            setTimestamp(date);
                        }}
                        onCancel={() => setShowDatePicker(false)}
                    />

                    <Text>Notes:</Text>
                    <TextInput
                        label="Notes"
                        value={notes}
                        onChangeText={setNotes}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        placeholder="null"
                        style={styles.notesInput}
                    />

                    <View style={styles.buttonRow}>
                        <Button onPress={() => onDelete(feedback?.feedback_id!)} textColor="red">
                            Delete
                        </Button>
                        <Button onPress={onDismiss}>Cancel</Button>
                        <Button mode="contained" onPress={handleUpdate}>Update</Button>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        margin: 20,
        padding: 20,
        borderRadius: 12,
    },
    title: {
        marginBottom: 12,
    },
    dropdown: {
        marginBottom: 16,
    },
    notesInput: {
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 8,
    },
    scrollContent: {
        paddingBottom: 100,
    },
});
