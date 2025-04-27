import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import FeedbackScreen from "../screens/Feedback/FeedbackScreen";
import AnalyticsScreen from "../screens/Analytics/AnalyticsScreen";
import BleScanScreen from "../screens/Test/BleScanScreen";

const Stack = createStackNavigator();

export function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Test" component={BleScanScreen} />
        </Stack.Navigator>
    );
}
