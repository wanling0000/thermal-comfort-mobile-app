import React, { createContext, useContext } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

type NotificationContextType = {
    notify: (message: string, title?: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
    notify: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const notify = (message: string, title = 'Notice') => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert(title, message, [{ text: 'OK' }]);
        }
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}
