import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NotificationProvider } from "./src/contexts/NotificationContext";
import { applyPolyfills } from './src/utils/polyfill';

applyPolyfills();

export default function App() {
    return (
        <NotificationProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </NotificationProvider>
    );
}
