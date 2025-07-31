import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPENAI_API_KEY } from '@env';

const DAILY_LIMIT = 10;
const STORAGE_KEY_PREFIX = 'llm_call_count_';

export async function callOpenAIWithLimit(prompt: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0]; // e.g., 2025-07-30
    const storageKey = `${STORAGE_KEY_PREFIX}${today}`;

    const prev = parseInt(await AsyncStorage.getItem(storageKey) || '0', 10);
    if (prev >= DAILY_LIMIT) {
        throw new Error(`You’ve reached the daily limit of ${DAILY_LIMIT} LLM suggestions.`);
    }

    // 真正调用 GPT
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
        }),
    });

    const data = await res.json();

    if (!res.ok || !data.choices) {
        console.error('❌ OpenAI error:', data);
        throw new Error(data?.error?.message || 'OpenAI call failed');
    }

    await AsyncStorage.setItem(storageKey, (prev + 1).toString());

    return data.choices[0].message.content.trim();
}
