import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Modal,
    Portal,
    Card,
    Text,
    TextInput,
    Button,
    Chip,
    useTheme, Dialog,
} from 'react-native-paper';
import Icon from "@react-native-vector-icons/material-design-icons";
import {useLocation} from "../../../services/location/useLocation.ts";
import {UserLocationService} from "../../../services/api/UserLocationService.ts";
import {UserLocationTagInput} from "../../../types/Location.ts";

const defaultTags = ['Home', 'Office', 'Lab'];

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (tag: string) => void;
    currentDisplayName?: string;
}

const EditLocationModal = ({ visible, onClose, onSubmit, currentDisplayName }: Props) => {
    const [customTag, setCustomTag] = useState('');
    const [customTags, setCustomTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const theme = useTheme();
    const { location } = useLocation();
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingTag, setPendingTag] = useState<string | null>(null);

    const addCustomTag = () => {
        const tag = customTag.trim();
        if (tag && !customTags.includes(tag)) {
            setCustomTags([...customTags, tag]);
            setCustomTag('');
        }
    };

    const removeTag = (tag: string) => {
        setCustomTags(customTags.filter(t => t !== tag));
        if (selectedTag === tag) setSelectedTag(null);
    };

    const handleTagPress = (tag: string) => {
        setSelectedTag(tag === selectedTag ? null : tag);
    };

    const handleSave = () => {
        if (selectedTag) {
            onSubmit(selectedTag);
            setSelectedTag(null);
            setPendingTag(selectedTag);
            setConfirmVisible(true); // 弹出是否绑定地点
        }
    };

    const handleConfirm = async (bind: boolean) => {
        if (!pendingTag) return;

        const payload: UserLocationTagInput = {
            name: pendingTag,
            location: bind && location
                ? {
                    displayName: location.displayName,
                    latitude: location.latitude,
                    longitude: location.longitude,
                }
                : undefined,
        };

        try {
            await UserLocationService.createUserLocationTag(payload);
        } catch (err) {
            console.error('[UserLocationService] Failed to environment tag', err);
        }

        setConfirmVisible(false);
        setPendingTag(null);
        setSelectedTag(null);
        onSubmit(pendingTag);
    };


    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={onClose}
                    contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
                >
                    <Card mode="elevated">
                        <Card.Title title="Edit Location Tag" />
                        <Card.Content>
                            {currentDisplayName && (
                                <Text variant="bodySmall" style={styles.current}>
                                    Current: {currentDisplayName}
                                </Text>
                            )}

                            <View style={styles.chipRow}>
                                {defaultTags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        mode="outlined"
                                        selected={selectedTag === tag}
                                        onPress={() => handleTagPress(tag)}
                                        style={styles.chip}
                                    >
                                        {tag}
                                    </Chip>
                                ))}
                            </View>

                            <View style={styles.chipRow}>
                                {customTags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        mode="outlined"
                                        selected={selectedTag === tag}
                                        onPress={() => handleTagPress(tag)}
                                        onClose={() => removeTag(tag)}
                                        style={styles.chip}
                                    >
                                        {tag}
                                    </Chip>
                                ))}
                            </View>

                            <View style={styles.customInputRow}>
                                <TextInput
                                    mode="outlined"
                                    label="Custom tag"
                                    value={customTag}
                                    onChangeText={setCustomTag}
                                    style={styles.customInput}
                                    dense
                                />
                                <Icon
                                    name="plus-circle"
                                    size={28}
                                    color={theme.colors.primary}
                                    onPress={addCustomTag}
                                    style={styles.addIcon}
                                />
                            </View>
                        </Card.Content>
                        <Card.Actions style={styles.actionRow}>
                            <Button onPress={onClose}>Cancel</Button>
                            <Button onPress={handleSave} disabled={!selectedTag}>Save</Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
            <Portal>
                <Dialog visible={confirmVisible} onDismiss={() => setConfirmVisible(false)}>
                    <Dialog.Title>Bind Location?</Dialog.Title>
                    <Dialog.Content>
                        <Text>Do you want to bind this tag to your current location?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => handleConfirm(false)}>No</Button>
                        <Button onPress={() => handleConfirm(true)}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        margin: 24,
        padding: 16,
        borderRadius: 12,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
    },
    chip: {
        marginBottom: 8,
    },
    current: {
        marginBottom: 12,
    },
    customInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    customInput: {
        flex: 1,
    },
    addIcon: {
        marginLeft: 8,
    },
    actionRow: {
        justifyContent: 'flex-end',
        marginTop: 8,
    },
});

export default EditLocationModal;
