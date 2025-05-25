import 'react-native-reanimated';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();

import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';

import { Provider as PaperProvider } from 'react-native-paper';
import AppProviders from "./src/app/AppProviders.tsx";

export default function App() {
    return (
        <>
            <PaperProvider>
                <NavigationContainer>
                    <AppProviders />
                    <AppNavigator />
                </NavigationContainer>
            </PaperProvider>
        </>
    );
}
