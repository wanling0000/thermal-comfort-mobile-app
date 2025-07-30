import React, { useState } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
    Modal,
    Portal,
    Text,
    Button,
    TextInput,
    Title, Chip,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { ACTIVITY_TAGS } from '../constants/activityTags';
import {DetailedFeedbackInput, FeedbackWithReadingInput} from "../../../types/Feedback.ts";
import {EnvironmentalReading} from "../../../types/EnvironmentalReading.ts";
import { CLOTHING_TAGS} from "../constants/clothingTags.ts";

type Props = {
    visible: boolean;
    reading: EnvironmentalReading | null;
    onDismiss: () => void;
    onSubmit: (data: FeedbackWithReadingInput) => void;
};

const emojiOptions = [
    { value: -2, emoji: '🥶', label: 'Too Cold' },
    { value: -1, emoji: '🧊', label: 'Cold' },
    { value: 0, emoji: '😊', label: 'Comfortable' },
    { value: 1, emoji: '🌤️', label: 'Warm' },
    { value: 2, emoji: '🥵', label: 'Too Hot' },
];

const getAdjustTempLabel = (val: number) => {
    switch (val) {
        case -2: return 'Much Cooler';
        case -1: return 'Slightly Cooler';
        case 0: return 'No Change';
        case 1: return 'Slightly Warmer';
        case 2: return 'Much Warmer';
        default: return '';
    }
};

const getAdjustHumidLabel = (val: number) => {
    switch (val) {
        case -2: return 'Much Drier';
        case -1: return 'Slightly Drier';
        case 0: return 'No Change';
        case 1: return 'Slightly More Humid';
        case 2: return 'Much More Humid';
        default: return '';
    }
};


const FeedbackFormModal = ({ visible, reading, onDismiss, onSubmit }: Props) => {
    const [comfortLevel, setComfortLevel] = useState(0);
    const [adjustedTemp, setAdjustedTemp] = useState(0);
    const [adjustedHumid, setAdjustedHumid] = useState(0);
    const [activity, setActivity] = useState('sitting');
    const [clothingLevel, setClothingLevel] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        if (!reading || !reading.location) return;

        const loc = reading.location;

        const feedback: DetailedFeedbackInput = {
            comfort_level: comfortLevel,
            feedback_type: 'detailed',
            adjustedTempLevel: adjustedTemp,
            adjustedHumidLevel: adjustedHumid,
            clothingLevel,
            activityTypeId: activity,
            notes: notes.trim(),
            timestamp: Date.now(),
            location_display_name: loc.displayName,
            raw_coordinates: {
                latitude: loc.latitude,
                longitude: loc.longitude,
            },
            is_custom_location: loc.isCustom,
            custom_tag_name: loc.customTag,
        };

        const payload: FeedbackWithReadingInput = {
            feedback,
            reading,
        };

        console.log('[🟡 Submit FeedbackWithReadingInput]', JSON.stringify(payload, null, 2));

        onSubmit(payload);
    };


    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Title style={styles.title}>Detailed Feedback</Title>

                    <Text>Comfort Level:</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={-2}
                        maximumValue={2}
                        step={1}
                        value={comfortLevel}
                        onValueChange={setComfortLevel}
                    />
                    <Text style={{ textAlign: 'center', marginBottom: 12 }}>
                        {emojiOptions.find(opt => opt.value === comfortLevel)?.emoji} {emojiOptions.find(opt => opt.value === comfortLevel)?.label}
                    </Text>

                    <Text>Adjust Temperature:</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={-2}
                        maximumValue={2}
                        step={1}
                        value={adjustedTemp}
                        onValueChange={setAdjustedTemp}
                    />
                    <Text style={{ textAlign: 'center', marginBottom: 12 }}>
                        {getAdjustTempLabel(adjustedTemp)}
                    </Text>

                    <Text>Adjust Humidity:</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={-2}
                        maximumValue={2}
                        step={1}
                        value={adjustedHumid}
                        onValueChange={setAdjustedHumid}
                    />
                    <Text style={{ textAlign: 'center', marginBottom: 12 }}>
                        {getAdjustHumidLabel(adjustedHumid)}
                    </Text>

                    <Text style={{ marginTop: 12, marginBottom: 4 }}>Activity:</Text>
                    <View style={styles.chipContainer}>
                        {ACTIVITY_TAGS.map(tag => (
                            <Chip
                                key={tag.id}
                                selected={activity === tag.id}
                                onPress={() => setActivity(tag.id)}
                                style={styles.chip}
                            >
                                {tag.label}
                            </Chip>
                        ))}
                    </View>

                    <Text style={{ marginTop: 12, marginBottom: 4 }}>Clothing Level:</Text>
                    <View style={styles.chipContainer}>
                        {CLOTHING_TAGS.map(tag => (
                            <Chip
                                key={tag.id}
                                selected={clothingLevel === tag.id}
                                onPress={() => setClothingLevel(tag.id)}
                                style={styles.chip}
                            >
                                {tag.label}
                            </Chip>
                        ))}
                    </View>

                    <TextInput
                        label="Notes"
                        value={notes}
                        onChangeText={setNotes}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={{ marginBottom: 8 }}
                    />

                    <View style={styles.buttonRow}>
                        <Button onPress={onDismiss}>Cancel</Button>
                        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 12,
    },
    title: {
        marginBottom: 12,
    },
    slider: {
        width: '100%',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    scrollContent: {
        paddingBottom: 100,
    },
});

export default FeedbackFormModal;
