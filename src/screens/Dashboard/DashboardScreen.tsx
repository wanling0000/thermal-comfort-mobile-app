import React, {useEffect, useState} from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import TemperatureCard from './components/TemperatureCard';
import HumidityCard from './components/HumidityCard';
import { usePrimarySensorSummary } from '../../hooks/usePrimarySensorSummary';
import FeedbackCard from "./components/FeedbackCard.tsx";

import {useLocation} from "../../services/location/useLocation.ts";
import ChartCard from "./components/ChartCard.tsx";
import {assembleEnvironmentalReading} from "../../services/assemble/assembleEnvironmentalReading.ts";
import {environmentalBuffer} from "../../services/environment/environmentalDataBufferSingleton.ts";
import {Snackbar} from "react-native-paper";

const DashboardScreen = () => {
    const { summary, primarySensor, sensorDataList } = usePrimarySensorSummary();

    const { location, setCustomTag } = useLocation();

    const [feedbackSnackbarVisible, setFeedbackSnackbarVisible] = useState(false);

    const handleEditLocation = (newTag: string) => {
        setCustomTag(newTag); // 通过 ref 更新 customTag
    };

    useEffect(() => {
        if (sensorDataList.length === 0 || !location) return;

        const latest = sensorDataList[sensorDataList.length - 1];
        const reading = assembleEnvironmentalReading(latest, location);

        environmentalBuffer.addReading(reading);
    }, [sensorDataList, location]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.cardRow}>
                    <TemperatureCard
                        temperature={summary?.lastTemperature ?? null}
                        lastSeen={summary?.lastReadingTime}
                    />
                    <HumidityCard
                        humidity={summary?.lastHumidity ?? null}
                        lastSeen={summary?.lastReadingTime}
                    />
                </View>
                {location && (
                    <>
                        <FeedbackCard
                            location={location}
                            onEditLocation={handleEditLocation}
                            sensor={primarySensor}
                            onSubmittedFeedback={() => setFeedbackSnackbarVisible(true)}
                        />
                        <ChartCard />
                    </>
                )}
            </ScrollView>
            <Snackbar
                visible={feedbackSnackbarVisible}
                onDismiss={() => setFeedbackSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'OK',
                    onPress: () => setFeedbackSnackbarVisible(false),
                }}
            >
                Feedback submitted!
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16 },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
});

export default DashboardScreen;
