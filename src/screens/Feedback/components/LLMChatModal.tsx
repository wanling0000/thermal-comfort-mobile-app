import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, StyleSheet, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { LlmService } from "../../../services/api/LlmService";
import { MonthlyLLMInsightDTO } from "../../../types/llmInsight";
import { callOpenAIWithLimit } from "../../../services/llm/callOpenAI";
import { generatePrompt } from "../../../services/llm/generatePrompt";

type Props = {
    visible: boolean;
    date: Date;
    onDismiss: () => void;
};

export default function LLMChatModal({ visible, date, onDismiss }: Props) {
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [errorShown, setErrorShown] = useState(false);

    useEffect(() => {
        if (!visible) return;

        let timeout = setTimeout(() => {
            setErrorShown(true);
        }, 3000); // ⏱️ 等待 3 秒后才允许显示错误

        const fetchAndAsk = async () => {
            try {
                const insight: MonthlyLLMInsightDTO = await LlmService.getMonthlyInsight(date);
                const prompt = generatePrompt(insight);
                const result = await callOpenAIWithLimit(prompt);
                clearTimeout(timeout);
                setResponse(result);
            } catch (e: any) {
                clearTimeout(timeout);
                console.error('[🔥 LLM Modal Error]', e);

                if (e.message.includes('daily limit')) {
                    setResponse("⚠️ You've reached the daily limit of 10 AI suggestions. Please try again tomorrow.");
                } else {
                    setResponse("⚠️ An error occurred. Failed to generate suggestions.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAndAsk();

        return () => clearTimeout(timeout);
    }, [visible, date]);

    const userPrompt = "Please give some suggestions based on my thermal comfort data.";

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.messageBox}>
                        <Text style={styles.userLabel}>You</Text>
                        <Text style={styles.userBubble}>{userPrompt}</Text>
                    </View>

                    <View style={styles.messageBox}>
                        <Text style={styles.aiLabel}>AI</Text>
                        {loading && !errorShown ? (
                            <Text style={styles.aiBubble}>Thinking...</Text>
                        ) : (
                            <Text style={styles.aiBubble}>{response}</Text>
                        )}
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 12,
    },
    scroll: {
        minHeight: 200,
    },
    messageBox: {
        marginBottom: 16,
    },
    userLabel: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    aiLabel: {
        fontWeight: 'bold',
        color: '#007aff',
        marginBottom: 4,
    },
    userBubble: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
    },
    aiBubble: {
        backgroundColor: '#e6f0ff',
        padding: 12,
        borderRadius: 8,
    },
});
