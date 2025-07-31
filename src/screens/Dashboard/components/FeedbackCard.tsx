import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {Text, IconButton, Chip, Surface, Button, Card, Snackbar} from 'react-native-paper';
import EditLocationModal from './EditLocationModal';
import { LocationPreview } from '../../../types/Location';
import Icon from "@react-native-vector-icons/material-design-icons";
import {FeedbackService} from "../../../services/api/FeedbackService.ts";
import {QuickFeedbackInput} from "../../../types/Feedback.ts";
import {SensorData} from "../../../types/SensorData.ts";
import {assembleEnvironmentalReading} from "../../../services/assemble/assembleEnvironmentalReading.ts";
import {useFeedbackRefresh} from "../../../context/FeedbackRefreshContext.tsx";

const FeedbackCard = ({
                          location,
                          onEditLocation,
                          sensor,
                          onSubmittedFeedback,
                      }: {
    location: LocationPreview;
    onEditLocation: (newTag: string) => void;
    sensor: SensorData | null;
    onSubmittedFeedback?: () => void;
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<number | null>(0);
    const [showCoordinates, setShowCoordinates] = useState(false);
    const emojiOptions = [
        { value: -2, emoji: '🥶', label: 'Too Cold' },
        { value: -1, emoji: '🧊', label: 'Cold' },
        { value: 0, emoji: '😊', label: 'Comfortable' },
        { value: 1, emoji: '🌤️', label: 'Warm' },
        { value: 2, emoji: '🥵', label: 'Too Hot' },
    ];
    const { triggerRefresh } = useFeedbackRefresh();

    return (
        <>
            <Card style={styles.card}>
                <View style={styles.cardInner}>
                    <View style={styles.locationRow}>
                        <View style={styles.locationLabelRow}>
                            <Text variant="titleSmall" style={styles.locationText} numberOfLines={1}>
                                📍 {location.displayName ?? 'Unknown location'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowCoordinates(!showCoordinates)}>
                                <Icon name="information-outline" size={16} style={styles.infoIcon} />
                            </TouchableOpacity>
                        </View>

                        {location.customTag && (
                            <Chip mode="flat" compact style={styles.tagChip}>
                                {location.customTag.length > 16 ? location.customTag.slice(0, 16) + '...' : location.customTag}
                            </Chip>
                        )}

                        <IconButton
                            icon="pencil-outline"
                            size={16}
                            onPress={() => setModalVisible(true)}
                        />
                    </View>

                    {showCoordinates && (
                        <Text variant="bodySmall" style={styles.coordinates}>
                            {location.latitude.toFixed(5)}°N, {location.longitude.toFixed(5)}°E
                        </Text>
                    )}

                    <Text variant="bodySmall" style={styles.prompt}>
                        🤔 How comfortable are you right now?
                    </Text>
                    <View style={styles.emojiRow}>
                        {emojiOptions.map(({ value, emoji, label }) => (
                            <View key={value} style={styles.emojiWrapper}>
                                <TouchableOpacity onPress={() => setSelectedEmoji(value)}>
                                    <Text style={[styles.emoji, selectedEmoji === value && styles.emojiSelected]}>
                                        {emoji}
                                    </Text>
                                </TouchableOpacity>
                                {selectedEmoji === value && (
                                    <>
                                        <Surface style={styles.emojiSurface} mode="flat" elevation={3} >
                                            <></>
                                        </Surface>
                                        <Text style={styles.emojiLabel}>{label}</Text>
                                    </>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.actionButtons}>
                        <Button mode="contained-tonal" onPress={() => console.log('New Feedback')}>Add</Button>
                        <Button mode="outlined" onPress={() => setSelectedEmoji(null)} style={styles.actionButton}>Redo</Button>
                        <Button
                            mode="contained"
                            disabled={selectedEmoji === null || !sensor}
                            onPress={async () => {
                                if (selectedEmoji === null || !sensor) return;

                                const feedback: QuickFeedbackInput = {
                                    comfort_level: selectedEmoji,
                                    feedback_type: 'quick',
                                    timestamp: Date.now(),
                                    location_display_name: location.displayName,
                                    raw_coordinates: {
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                    },
                                    is_custom_location: location.isCustom,
                                    custom_tag_name: location.customTag,
                                };

                                const reading = assembleEnvironmentalReading(sensor, location);

                                const payload = {
                                    feedback,
                                    reading,
                                };

                                console.log('[FeedbackWithReadingInput]', payload);

                                try {
                                    await FeedbackService.submitFeedbackWithReading(payload);
                                    setSelectedEmoji(null);
                                    triggerRefresh();
                                    onSubmittedFeedback?.();
                                } catch (err) {
                                    console.error('❌ Submission failed', err);
                                }
                            }}
                            style={styles.actionButton}
                        >
                            Submit
                        </Button>
                    </View>
                </View>
            </Card>

            <EditLocationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={(tag) => {
                    setModalVisible(false);
                    onEditLocation(tag);
                }}
                currentDisplayName={location.displayName}
                location={location}
            />
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
    },
    cardInner: {
        padding: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationLabelRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        flex: 1,
        marginRight: 4,
    },
    infoIcon: {
        marginLeft: 4,
        marginRight: 4,
    },
    tagChip: {
        marginLeft: 4,
        marginRight: 4,
    },
    coordinates: {
        marginBottom: 12,
    },
    emojiWrapper: {
        alignItems: 'center',
        marginHorizontal: 4,
    },

    emojiSurface: {
        marginTop: 4,
        width: 28,
        height: 6,
        borderRadius: 3,
    },

    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    emoji: {
        fontSize: 28,
        opacity: 0.5,
    },
    emojiSelected: {
        opacity: 1,
        transform: [{ scale: 1.2 }],
    },
    emojiLabel: {
        fontSize: 12,
        marginTop: 4,
        color: '#555',
    },

    prompt: {
        textAlign: 'center',
        marginBottom: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
    },
});

export default FeedbackCard;
