import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import FeedbackScreen from "../screens/Feedback/FeedbackScreen";
import AnalyticsScreen from "../screens/Analytics/AnalyticsScreen";

const Tab = createBottomTabNavigator();

export function AppNavigator() {
    return (
        <Tab.Navigator initialRouteName="Dashboard">
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Feedback" component={FeedbackScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen}/>
            <Tab.Screen name="Settings" component={SettingsScreen} />
            {/*<Tab.Screen name="Test" component={BleScanScreen} />*/}
        </Tab.Navigator>
    );
}
