import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Modal,
    Portal,
    Text,
    Button,
    TextInput,
    RadioButton,
    Title,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { ACTIVITY_TAGS } from '../constants/activityTags';

const FeedbackFormModal = ({ visible, onDismiss, onSubmit }) => {
    const [comfortLevel, setComfortLevel] = useState(0);
    const [adjustedTemp, setAdjustedTemp] = useState(0);
    const [adjustedHumid, setAdjustedHumid] = useState(0);
    const [activity, setActivity] = useState('sitting');
    const [clothingLevel, setClothingLevel] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        onSubmit({
            comfort_level: comfortLevel,
            feedback_type: 'detailed',
            adjustedTempLevel: adjustedTemp,
            adjustedHumidLevel: adjustedHumid,
            clothingLevel,
            activityTypeId: activity,
            notes,
            timestamp: Date.now(),
        });
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
                <Title style={styles.title}>Detailed Feedback</Title>

                <Text>Comfort Level (from 🥶 to 🥵):</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={-2}
                    maximumValue={2}
                    step={1}
                    value={comfortLevel}
                    onValueChange={setComfortLevel}
                />

                <Text>Adjust Temperature:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={-2}
                    maximumValue={2}
                    step={1}
                    value={adjustedTemp}
                    onValueChange={setAdjustedTemp}
                />

                <Text>Adjust Humidity:</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={-2}
                    maximumValue={2}
                    step={1}
                    value={adjustedHumid}
                    onValueChange={setAdjustedHumid}
                />

                <Text>Activity:</Text>
                <RadioButton.Group onValueChange={setActivity} value={activity}>
                    {ACTIVITY_TAGS.map(tag => (
                        <RadioButton.Item key={tag.id} label={tag.label} value={tag.id} />
                    ))}
                </RadioButton.Group>

                <TextInput
                    label="Clothing"
                    value={clothingLevel}
                    onChangeText={setClothingLevel}
                    mode="outlined"
                />

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
});

export default FeedbackFormModal;
