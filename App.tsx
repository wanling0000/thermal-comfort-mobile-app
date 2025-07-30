import 'react-native-reanimated';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React, {useEffect} from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();

import { NavigationContainer } from '@react-navigation/native';

import { Provider as PaperProvider } from 'react-native-paper';
import AppProviders from "./src/app/AppProviders.tsx";
import RootNavigator from "./src/navigation/RootNavigator.tsx";
import {setNavigator} from "./src/utils/navigationHelper.ts";
import {AuthProvider} from "./src/app/AuthContext.tsx";
import {FeedbackRefreshProvider} from "./src/context/FeedbackRefreshContext.tsx";


export default function App() {

    return (
        <PaperProvider>
            <AuthProvider>
                <NavigationContainer ref={(ref) => ref && setNavigator(ref)}>
                    <FeedbackRefreshProvider>
                        <AppProviders />
                        <RootNavigator />
                    </FeedbackRefreshProvider>
                </NavigationContainer>
            </AuthProvider>
        </PaperProvider>
    );
}

